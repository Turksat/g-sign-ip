import faiss
import numpy as np
import pickle
from typing import List, Tuple
from scipy.sparse import vstack, save_npz, load_npz
from sklearn.feature_extraction.text import TfidfVectorizer
from .data_structures import PatentDocument

class PatentVectorStore:
    def __init__(self, embedding_dim: int, index_type: str = "IndexFlatIP"):
        self.embedding_dim = embedding_dim
        self.index_type = index_type
        
        if index_type == "IndexFlatIP":
            self.index = faiss.IndexFlatIP(embedding_dim)
        elif index_type == "IndexIVFFlat":
            nlist = 100
            quantizer = faiss.IndexFlatIP(embedding_dim)
            self.index = faiss.IndexIVFFlat(quantizer, embedding_dim, nlist, faiss.METRIC_INNER_PRODUCT)
        else:
            self.index = faiss.IndexFlatIP(embedding_dim)
            
        self.documents: List[PatentDocument] = []
        self.metadata = []
        self.tfidf_vectorizer = TfidfVectorizer(max_features=10000, stop_words='english')
        self.tfidf_matrix = None
        print(f"Initialized FAISS index with dimension {embedding_dim} and type {index_type}")

    def add_documents(self, documents: List[PatentDocument], embeddings: np.ndarray):
        embeddings = embeddings.astype('float32')
        faiss.normalize_L2(embeddings)
        
        if self.index_type == "IndexIVFFlat" and not self.index.is_trained:
            print("IVFFlat index is not trained. Training with current embeddings...")
            self.index.train(embeddings)
            
        self.index.add(embeddings)
        self.documents.extend(documents)
        self.metadata.extend([{
            'publication_number': doc.publication_number,
            'family_id': doc.family_id,
            'country_code': doc.country_code,
            'title': doc.title,
            'abstract': doc.abstract,
            'cpc_codes': doc.cpc_codes,
            'ipc_codes': doc.ipc_codes,
            'assignees': doc.assignees,
            'inventors': doc.inventors,
            'publication_date': doc.publication_date,
            'filing_date': doc.filing_date,
            'grant_date': doc.grant_date,
            'priority_date': doc.priority_date,
            'filing_year': doc.get_filing_year(),
            'publication_year': doc.get_publication_year(),
            'is_granted': doc.is_granted(),
            'citations': doc.citations
        } for doc in documents])
        
        new_texts = [doc.get_searchable_text() for doc in documents]
        if self.tfidf_matrix is None or self.tfidf_matrix.shape[0] == 0:
            self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(new_texts)
        else:
            new_tfidf = self.tfidf_vectorizer.transform(new_texts)
            self.tfidf_matrix = vstack([self.tfidf_matrix, new_tfidf])

    def search(self, query_embedding: np.ndarray, k: int = 100) -> List[Tuple[int, float]]:
        query_embedding = query_embedding.astype('float32').reshape(1, -1)
        faiss.normalize_L2(query_embedding)
        scores, indices = self.index.search(query_embedding, k)
        return [(int(idx), float(score)) for idx, score in zip(indices[0], scores[0]) if idx != -1]

    def get_document(self, index: int) -> PatentDocument:
        if 0 <= index < len(self.documents):
            return self.documents[index]
        return None

    def save_index(self, filepath_prefix: str):
        faiss.write_index(self.index, f"{filepath_prefix}.faiss")
        if self.tfidf_matrix is not None:
            save_npz(f"{filepath_prefix}_tfidf_matrix.npz", self.tfidf_matrix)
        with open(f"{filepath_prefix}_metadata.pkl", 'wb') as f:
            pickle.dump({
                'documents': self.documents,
                'metadata': self.metadata,
                'tfidf_vectorizer': self.tfidf_vectorizer,
            }, f)
        print(f"Index saved to {filepath_prefix}.faiss and related files.")

    def load_index(self, filepath_prefix: str):
        self.index = faiss.read_index(f"{filepath_prefix}.faiss")
        try:
            self.tfidf_matrix = load_npz(f"{filepath_prefix}_tfidf_matrix.npz")
        except FileNotFoundError:
            print(f"TF-IDF matrix file not found at {filepath_prefix}_tfidf_matrix.npz. TF-IDF search will not work.")
            self.tfidf_matrix = None
        with open(f"{filepath_prefix}_metadata.pkl", 'rb') as f:
            data = pickle.load(f)
            self.documents = data['documents']
            self.metadata = data['metadata']
            self.tfidf_vectorizer = data['tfidf_vectorizer']
        print(f"Index loaded from {filepath_prefix}.faiss and related files.")
