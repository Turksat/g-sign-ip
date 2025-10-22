from typing import List, Dict, Any
from collections import defaultdict
import torch
from .preprocessor import PatentTextPreprocessor
from .models import EmbeddingModel, Qwen3RerankerModel
from .vector_store import PatentVectorStore
from .llm_analyzer import create_llm_analyzer
import json

class PatentRAGSystem:
    def __init__(self, config: Dict):
        print("Initializing Patent RAG System")
        self.config = config
        self.preprocessor = PatentTextPreprocessor()
        
        print("Loading embedding models...")
        self.qwen3_embedder = EmbeddingModel(
            self.config['models']['primary_embedding'],
            model_kwargs={
                "attn_implementation": "flash_attention_2",
                "device_map": "auto",
                "torch_dtype": torch.float16
            },
            trust_remote_code=True
        )
        
        self.patent_sberta = EmbeddingModel(self.config['models']['secondary_embedding'])
        
        print("Loading reranker model...")
        self.qwen3_reranker = Qwen3RerankerModel(self.config['models']['reranker'])
        
        print("Loading LLM analyzer...")
        llm_config = self.config.get('llm_config', {})
        self.llm_analyzer = create_llm_analyzer(llm_config)

        embedding_dims = self.config['embedding_dims']
        self.primary_store = PatentVectorStore(embedding_dims['primary'])
        self.secondary_store = PatentVectorStore(embedding_dims['secondary'])
        print("Patent RAG System initialized successfully")

    def load_index(self, index_path_prefix: str):
        print(f"Loading indices from {index_path_prefix}")
        try:
            self.primary_store.load_index(f"{index_path_prefix}_primary")
            self.secondary_store.load_index(f"{index_path_prefix}_secondary")
            print("Indices loaded successfully")
        except FileNotFoundError as e:
            print(f"Index files not found: {e}")
            raise

    def _reciprocal_rank_fusion(self, ranked_lists: list[list[tuple]]) -> list[tuple]:
        rrf_scores = defaultdict(float)
        k = self.config['retrieval'].get('rrf_k', 60)
        
        for ranked_list in ranked_lists:
            for rank, (doc_id, _) in enumerate(ranked_list):
                rrf_scores[doc_id] += 1 / (k + rank + 1)
        
        return sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)

    def _hybrid_retrieval_stage(self, qwen3_embedding, sberta_embedding):
        primary_results = self.primary_store.search(
            qwen3_embedding, 
            k=self.config['retrieval']['initial_k']
        )
        sberta_results = self.secondary_store.search(
            sberta_embedding, 
            k=self.config['retrieval']['secondary_k']
        )
        
        print(f"Primary retrieval found {len(primary_results)} candidates.")
        print(f"Secondary retrieval found {len(sberta_results)} candidates.")

        return self._reciprocal_rank_fusion([primary_results, sberta_results])

    def _reranking_stage(self, query: str, candidates: list[tuple], top_k: int, priority_year: int = None, granted_filter: bool = None):
        reranking_candidates = candidates[:self.config['retrieval']['rerank_k']]
        
        candidate_docs_text = []
        candidate_indices = []
        
        for idx, _ in reranking_candidates:
            doc = self.primary_store.get_document(idx)
            if doc:
                candidate_docs_text.append(doc.get_searchable_text())
                candidate_indices.append(idx)
        
        if not candidate_docs_text:
            return []

        reranked_results = self.qwen3_reranker.rerank(
            query, 
            candidate_docs_text, 
            top_k=min(top_k, len(candidate_docs_text))
        )
        
        final_doc_ids_scores = []
        for _, (doc_idx, relevance_score) in enumerate(reranked_results):
            original_idx = candidate_indices[doc_idx]
            final_doc_ids_scores.append((original_idx, relevance_score))

        return self._format_results(final_doc_ids_scores, method="With Reranking", priority_year=priority_year, granted_filter=granted_filter)

    def _format_results(self, doc_ids_scores: list[tuple], method: str, priority_year: int = None, granted_filter: bool = None) -> List[Dict[str, Any]]:
        final_results = []
        seen_families = set()
        
        for rank, (idx, score) in enumerate(doc_ids_scores):
            doc = self.primary_store.get_document(idx)
            if doc:
                if granted_filter is not None:
                    if granted_filter and not doc.is_granted():
                        continue
                    elif not granted_filter and doc.is_granted():
                        continue
                
                if self.config.get('deduplication', {}).get('by_family', False):
                    if doc.family_id in seen_families:
                        continue
                    seen_families.add(doc.family_id)
                
                classification_info = self.preprocessor.extract_classification_codes(
                    doc.cpc_codes, doc.ipc_codes)
                
                citations = self.preprocessor.parse_citation_list(doc.citations)
                
                is_valid_prior_art = True
                if priority_year and doc.get_filing_year():
                    is_valid_prior_art = doc.get_filing_year() < priority_year
                
                result = {
                    'rank': rank + 1,
                    'document_id': doc.publication_number,
                    'family_id': doc.family_id,
                    'title': doc.title,
                    'abstract': doc.abstract,
                    'relevance_score': score,
                    'assignees': self.preprocessor.parse_citation_list(doc.assignees) if isinstance(doc.assignees, str) else doc.assignees,
                    'inventors': self.preprocessor.parse_citation_list(doc.inventors) if isinstance(doc.inventors, str) else doc.inventors,
                    'cpc_codes': classification_info['cpc_codes'],
                    'ipc_codes': classification_info['ipc_codes'],
                    'technology_areas': classification_info['technology_areas'],
                    'technical_terms': self.preprocessor.extract_technical_terms(doc.get_searchable_text()),
                    'method': method,
                    'country_code': doc.country_code,
                    'filing_year': doc.get_filing_year(),
                    'publication_year': doc.get_publication_year(),
                    'priority_year': doc.get_priority_year(),
                    'is_granted': doc.is_granted(),
                    'metadata_summary': doc.get_metadata_summary(),
                    'citation_count': len(citations),
                    'citations_sample': citations[:5],
                    'is_valid_prior_art': is_valid_prior_art,
                    'temporal_relevance': self._calculate_temporal_relevance(doc, priority_year)
                }
                final_results.append(result)
        return final_results
    
    def _calculate_temporal_relevance(self, doc, priority_year: int = None) -> str:
        if not priority_year or not doc.get_filing_year():
            return "Unknown"
        
        years_diff = priority_year - doc.get_filing_year()
        if years_diff > 10:
            return "Historical (>10 years prior)"
        elif years_diff > 5:
            return "Established (5-10 years prior)"
        elif years_diff > 0:
            return "Recent (within 5 years)"
        else:
            return "Contemporary/Later filing"

    def retrieve(self, query: str, top_k: int = 10, rerank: bool = False, priority_year: int = None, granted_filter: bool = None) -> List[Dict[str, Any]]:
        print(f"Processing query: '{query[:500]}...'")
        processed_query = self.preprocessor.clean_patent_text(query)
        qwen3_embedding = self.qwen3_embedder.encode_single(processed_query)
        sberta_embedding = self.patent_sberta.encode_single(processed_query)
        
        sorted_candidates = self._hybrid_retrieval_stage(qwen3_embedding, sberta_embedding)
        
        if rerank:
            final_results = self._reranking_stage(query, sorted_candidates, top_k, priority_year, granted_filter)
        else:
            final_results = self._format_results(sorted_candidates[:top_k], method="No Reranking (RRF)", priority_year=priority_year, granted_filter=granted_filter)

        print(f"Final ranking completed with {len(final_results)} results.")
        return final_results

    def analyze_patent(self, patent_text: str, top_k: int = 5, rerank: bool = True, priority_year: int = None, granted_filter: bool = None) -> Dict[str, Any]:
        print("--- Starting Comprehensive Patent Analysis ---")
        
        retrieved_docs = self.retrieve(patent_text, top_k=top_k, rerank=rerank, priority_year=priority_year, granted_filter=granted_filter)
        if not retrieved_docs:
            return {"error": "No relevant prior art found."}

        analysis_text = self.llm_analyzer.generate_analysis(patent_text, retrieved_docs)

        parsed_analysis = analysis_text
        if isinstance(analysis_text, str):
            try:
                parsed_analysis = json.loads(analysis_text)
            except json.JSONDecodeError:
                parsed_analysis = analysis_text

        return {
            "analysis": parsed_analysis,
            "retrieved_documents": retrieved_docs
        }