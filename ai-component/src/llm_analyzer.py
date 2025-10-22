from typing import List, Dict, Any, Optional
import os
import re
from .llamacpp_analyzer import LlamaCppAnalyzer
from .transformers_analyzer import TransformersAnalyzer


class LLMAnalyzer:
    def __init__(self, llm_config: Optional[Dict[str, Any]] = None):
        self.llm_config = llm_config or {}
        self.backend = self.llm_config.get('backend', 'transformers')
        self.analyzer = None
        self.prompt_template = self._load_prompt_template()
        
        print(f"Initializing LLM Analyzer with backend: {self.backend}")
        
        if self.backend == 'llamacpp':
            self._init_llamacpp()
        else:
            self._init_transformers()

    def _load_prompt_template(self) -> str:
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(current_dir)
            prompt_path = os.path.join(project_root, 'prompt.md')
            
            with open(prompt_path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        except Exception as e:
            print(f"Warning: Could not load prompt template from prompt.md: {e}")
            raise RuntimeError("Prompt template not found. Ensure prompt.md exists in the project root.")

    def _init_transformers(self):
        transformers_config = self.llm_config.get('transformers', {})
        model_name = transformers_config.get('model')
        
        if not model_name:
            raise ValueError("Model name must be specified in llm_config.transformers.model")
        
        try:
            self.analyzer = TransformersAnalyzer(model_name, transformers_config)
            print("Transformers LLM Analyzer loaded successfully.")
        except Exception as e:
            print(f"Error loading Transformers LLM: {e}")
            raise RuntimeError(f"Could not load Transformers LLM '{model_name}': {e}")

    def _init_llamacpp(self):
        llamacpp_config = self.llm_config.get('llamacpp', {})
        full_config = {**llamacpp_config, **llamacpp_config.get('generation', {})}
        
        try:
            self.analyzer = LlamaCppAnalyzer(full_config)
            print("LlamaCpp LLM Analyzer loaded successfully.")
        except Exception as e:
            print(f"Error loading LlamaCpp LLM: {e}")
            raise RuntimeError(f"Could not load LlamaCpp LLM: {e}")

    def format_analysis_prompt(self, patent_text: str, retrieved_docs: List[Dict[str, Any]]) -> str:
        retrieved_docs_text = "[\n"
        for i, doc in enumerate(retrieved_docs):
            retrieved_docs_text += "  {\n"
            retrieved_docs_text += f"    \"publication_number\": \"{doc.get('document_id', 'N/A')}\",\n"
            retrieved_docs_text += f"    \"title\": \"{doc.get('title', 'N/A')}\",\n"
            retrieved_docs_text += f"    \"abstract\": \"{doc.get('abstract', 'N/A')}\",\n"
            retrieved_docs_text += f"    \"description\": \"{doc.get('description', doc.get('abstract', 'N/A'))}\",\n"
            retrieved_docs_text += f"    \"claims\": \"{doc.get('claims', 'N/A')}\",\n"
            retrieved_docs_text += f"    \"priority_date\": \"{doc.get('priority_date', 'N/A')}\",\n"
            retrieved_docs_text += f"    \"publication_date\": \"{doc.get('publication_date', 'N/A')}\",\n"
            retrieved_docs_text += f"    \"grant_date\": \"{doc.get('grant_date', 'N/A')}\",\n"
            retrieved_docs_text += f"    \"cpc_codes\": {doc.get('cpc_codes', [])},\n"
            retrieved_docs_text += f"    \"ipc_codes\": {doc.get('ipc_codes', [])},\n"
            retrieved_docs_text += f"    \"relevance_score\": {doc.get('relevance_score', 0.0)}\n"
            retrieved_docs_text += "  }"
            if i < len(retrieved_docs) - 1:
                retrieved_docs_text += ","
            retrieved_docs_text += "\n"
        retrieved_docs_text += "]"

        
        prompt = self.prompt_template
        prompt = prompt.replace("{patent_text}", patent_text)
        prompt = prompt.replace("{retrieved_docs_text}", retrieved_docs_text)
        
        return prompt

    def generate_analysis(self, patent_text: str, retrieved_docs: List[Dict[str, Any]]) -> str:
        if not self.analyzer:
            return f"LLM analysis is unavailable - {self.backend} analyzer not initialized."
        
        prompt = self.format_analysis_prompt(patent_text, retrieved_docs)
        
        response = self.analyzer.generate_analysis(prompt)

        try:
            with open('debug_response.txt', 'w', encoding='utf-8') as f:
                f.write(response)
                print("Debug: Response written to debug_response.txt")
        except Exception as e:
            print(f"Debug: Failed to write response to file: {e}")
        
        response = self._clean_response(response)

        return response

    def _clean_response(self, response: str) -> str:
        response = re.sub(r'<think>.*?</think>', '', response, flags=re.DOTALL)        
        response = re.sub(r'^```\w*\n', '', response, flags=re.MULTILINE)
        response = re.sub(r'\n```$', '', response, flags=re.MULTILINE)
        response = response.strip()
        if response.startswith('```'):
            response = response[3:].strip()
        if response.endswith('```'):
            response = response[:-3].strip()
        
        return response

def create_llm_analyzer(llm_config: Optional[Dict[str, Any]] = None) -> LLMAnalyzer:
    return LLMAnalyzer(llm_config)
