import torch
from transformers import pipeline, BitsAndBytesConfig
from typing import List, Dict, Any


class TransformersAnalyzer:
    def __init__(self, model_name: str, transformers_config: Dict[str, Any]):
        self.model_name = model_name
        self.transformers_config = transformers_config
        self.pipeline = None
        self._load_model()

    def _load_model(self):
        print(f"Loading Transformers model: {self.model_name}")
        
        try:
            quantization_config = self.transformers_config.get('quantization', {})
            
            if quantization_config.get('enabled', True):
                quant_config = BitsAndBytesConfig(
                    load_in_4bit=quantization_config.get('load_in_4bit', True),
                    bnb_4bit_quant_type=quantization_config.get('bnb_4bit_quant_type', "nf4"),
                    bnb_4bit_compute_dtype=getattr(torch, quantization_config.get('bnb_4bit_compute_dtype', 'bfloat16'))
                )
            else:
                quant_config = None
                
            model_kwargs = {}
            if quant_config:
                model_kwargs["quantization_config"] = quant_config
                
            self.pipeline = pipeline(
                "text-generation",
                model=self.model_name,
                model_kwargs=model_kwargs,
                device_map="auto"
            )
            
            print("Transformers model loaded successfully.")
            
        except Exception as e:
            print(f"Error loading Transformers model: {e}")
            raise RuntimeError(f"Could not load Transformers model '{self.model_name}': {e}")

    def generate_analysis(self, prompt: str) -> str:
        if not self.pipeline:
            return "Transformers analysis is unavailable - model not loaded."

        messages = [{"role": "user", "content": prompt}]

        try:
            print("Generating Transformers analysis...")
            
            generation_config = self.transformers_config.get('generation', {})
            output = self.pipeline(
                messages, 
                max_new_tokens=generation_config.get('max_new_tokens', 1000), 
                temperature=generation_config.get('temperature', 0.7), 
                do_sample=generation_config.get('do_sample', True)
            )
            
            print("Transformers analysis generation completed.")
            analysis_text = output[0]['generated_text']
            
            if isinstance(analysis_text, list) and len(analysis_text) > 0:
                for msg in reversed(analysis_text):
                    if isinstance(msg, dict) and msg.get('role') == 'assistant':
                        return msg.get('content', 'No analysis content generated.')
            elif isinstance(analysis_text, str):
                if prompt in analysis_text:
                    return analysis_text.replace(prompt, '').strip()
                return analysis_text
            
            return "No valid analysis generated."
            
        except Exception as e:
            print(f"Transformers analysis generation failed: {e}")
            return f"Transformers analysis failed due to an error: {e}"

    def __del__(self):
        if hasattr(self, 'pipeline') and self.pipeline:
            del self.pipeline
