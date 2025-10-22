import re
from typing import List, Dict
import pandas as pd
import spacy
from collections import Counter

class PatentTextPreprocessor:
    def __init__(self):
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Warning: spaCy model 'en_core_web_sm' not found. Please run 'python -m spacy download en_core_web_sm'. Using basic processing.")
            self.nlp = None

        self.technical_patterns = {
            'claim_numbers': r'\b(?:claim\s+)?(\d+)\.\s*',
            'reference_numbers': r'\b\d{2,3}\b',
            'figure_refs': r'(?:FIG\\.?\\s*|Figure\\s+)(\d+[A-Z]?)',
            'patent_numbers': r'(?:US|EP|WO|CN|JP)\s*\d{4,}(?:[A-Z]\d*)?(?:/\d+)?',
            'legal_phrases': r'\b(?:wherein|whereby|further comprising|characterized by|according to|as claimed in)\b',
            'citations': r'(?:see\s+)?(?:U\.S\.\s+)?(?:Patent\s+)?(?:No\.?\s*)?(\d{1,2},?\d{3},?\d{3})',
            'technical_numbers': r'\b\d+(?:\.\d+)?\s*(?:mm|cm|m|kg|g|MHz|GHz|°C|°F|V|A|W)\b',
            'chemical_formulas': r'\b[A-Z][a-z]?(?:\d+)?(?:[A-Z][a-z]?\d*)*\b'
        }

        self.abbreviations = {
            'e.g.': 'for example', 'i.e.': 'that is', 'et al.': 'and others',
            'vs.': 'versus', 'etc.': 'and so on', 'w.r.t.': 'with respect to',
            'cf.': 'compare', 'viz.': 'namely'
        }

        self.patent_stopwords = {
            'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'for', 'with', 'about',
            'invention', 'embodiment', 'preferred', 'according', 'present',
            'disclosed', 'described', 'shown', 'illustrated', 'comprises',
            'includes', 'containing', 'having', 'providing', 'method',
            'system', 'apparatus', 'device', 'means', 'step', 'feature',
            'thereof', 'herein', 'said', 'first', 'second', 'one', 'more', 'least'
        }

    def clean_patent_text(self, text: str) -> str:
        if not text or pd.isna(text):
            return ""
        
        text = text.lower()
        
        for abbr, expansion in self.abbreviations.items():
            text = text.replace(abbr, expansion)
        
        text = re.sub(self.technical_patterns['claim_numbers'], '', text)
        text = re.sub(self.technical_patterns['patent_numbers'], 'PATENT_REF ', text)
        text = re.sub(self.technical_patterns['figure_refs'], ' FIGURE_REF ', text)
        
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\.,;:\-]', ' ', text)
        text = re.sub(r'\s*([.,;:])\s*', r'\1 ', text)
        
        return text.strip()

    def extract_technical_terms(self, text: str, max_terms: int = 25) -> List[str]:
        if not text or not self.nlp:
            return []
            
        doc = self.nlp(self.clean_patent_text(text))
        
        terms = [
            chunk.text.lower() for chunk in doc.noun_chunks
            if 2 <= len(chunk.text.split()) <= 4
        ]
        
        filtered_terms = [
            term for term in terms 
            if not all(word in self.patent_stopwords for word in term.split())
        ]
        
        term_counts = Counter(filtered_terms)
        return [term for term, count in term_counts.most_common(max_terms)]

    def extract_patent_metadata(self, text: str) -> Dict[str, List[str]]:
        metadata = {
            'figure_references': list(set(re.findall(self.technical_patterns['figure_refs'], text, re.IGNORECASE))),
            'patent_citations': list(set(re.findall(self.technical_patterns['patent_numbers'], text, re.IGNORECASE))),
            'technical_measurements': list(set(re.findall(self.technical_patterns['technical_numbers'], text, re.IGNORECASE))),
            'chemical_formulas': [m for m in set(re.findall(self.technical_patterns['chemical_formulas'], text)) if len(m) > 2]
        }
        return metadata

    def parse_citation_list(self, citations_str: str) -> List[str]:
        if not citations_str or pd.isna(citations_str):
            return []
        
        try:
            import ast
            if citations_str.startswith('[') and citations_str.endswith(']'):
                parsed = ast.literal_eval(citations_str)
                if isinstance(parsed, list):
                    return [str(cite).strip() for cite in parsed if cite]
        except (ValueError, SyntaxError):
            pass
        
        delimiters = [',', ';', '\n', '|']
        citations = [citations_str]
        for delimiter in delimiters:
            new_citations = []
            for citation in citations:
                new_citations.extend(citation.split(delimiter))
            citations = new_citations
        
        return [cite.strip() for cite in citations if cite.strip()]

    def extract_classification_codes(self, cpc_codes: str, ipc_codes: str) -> Dict[str, List[str]]:
        def parse_codes(codes_str):
            if not codes_str or pd.isna(codes_str):
                return []
            try:
                import ast
                if codes_str.startswith('[') and codes_str.endswith(']'):
                    parsed = ast.literal_eval(codes_str)
                    if isinstance(parsed, list):
                        return [str(code).strip() for code in parsed if code]
            except (ValueError, SyntaxError):
                pass
            return [code.strip() for code in codes_str.split(',') if code.strip()]
        
        cpc_list = parse_codes(cpc_codes)
        ipc_list = parse_codes(ipc_codes)
        
        return {
            'cpc_codes': cpc_list,
            'ipc_codes': ipc_list,
            'main_classifications': cpc_list[:3] + ipc_list[:3],  # Most important ones
            'technology_areas': self._extract_tech_areas(cpc_list + ipc_list)
        }
    
    def _extract_tech_areas(self, classification_codes: List[str]) -> List[str]:
        """
        Map classification codes to human-readable technology areas.
        """
        tech_mapping = {
            'A': 'Human Necessities',
            'B': 'Operations & Transport', 
            'C': 'Chemistry & Metallurgy',
            'D': 'Textiles & Paper',
            'E': 'Fixed Constructions',
            'F': 'Mechanical Engineering',
            'G': 'Physics',
            'H': 'Electricity',
            'Y': 'Emerging Technologies'
        }
        
        areas = set()
        for code in classification_codes:
            if code and len(code) > 0:
                main_class = code[0].upper()
                if main_class in tech_mapping:
                    areas.add(tech_mapping[main_class])
        
        return list(areas)
