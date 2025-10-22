import torch
import numpy as np
from typing import List, Tuple
from transformers import AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer

class EmbeddingModel:
    def __init__(self, model_name: str, device: str = "cuda" if torch.cuda.is_available() else "cpu", **kwargs):
        print(f"Loading embedding model: {model_name} on {device}")
        try:
            self.model = SentenceTransformer(model_name, device=device, **kwargs)
            self.embedding_dim = self.model.get_sentence_embedding_dimension()
            print(f"Model loaded successfully with embedding dimension: {self.embedding_dim}")
        except Exception as e:
            print(f"Failed to load model: {e}")
            raise RuntimeError(f"Could not load model '{model_name}': {e}")

    def encode(self, texts: List[str], batch_size: int = 32) -> np.ndarray:
        return np.array(self.model.encode(texts, convert_to_tensor=False, batch_size=batch_size, show_progress_bar=False))

    def encode_single(self, text: str) -> np.ndarray:
        return self.model.encode([text], convert_to_tensor=False)[0]

class Qwen3RerankerModel:
    def __init__(self, model_name: str, device: str = "cuda" if torch.cuda.is_available() else "cpu"):
        self.device = device
        self.model_name = model_name
        print(f"Loading Reranking model: {self.model_name} on {self.device}")
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, padding_side='left', trust_remote_code=True)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name, 
                torch_dtype=torch.float16, 
                attn_implementation="flash_attention_2", 
                trust_remote_code=True
            ).to(self.device).eval()
            
            self.token_false_id = self.tokenizer.convert_tokens_to_ids("no")
            self.token_true_id = self.tokenizer.convert_tokens_to_ids("yes")
            self.max_length = 8192
            
            prefix = "<|im_start|>system\nJudge whether the Document meets the requirements based on the Query and the Instruct provided. Note that the answer can only be \"yes\" or \"no\".<|im_end|>\n<|im_start|>user\n"
            suffix = "<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n"
            self.prefix_tokens = self.tokenizer.encode(prefix, add_special_tokens=False)
            self.suffix_tokens = self.tokenizer.encode(suffix, add_special_tokens=False)
            print("Reranker model loaded successfully")
        except Exception as e:
            print(f"Failed to load model: {e}")
            raise RuntimeError(f"Could not load model '{self.model_name}': {e}")

    def format_instruction(self, instruction: str, query: str, doc: str) -> str:
        if instruction is None:
            instruction = 'Given a web search query, retrieve relevant passages that answer the query'
        return f"<Instruct>: {instruction}\n<Query>: {query}\n<Document>: {doc}"

    def process_inputs(self, pairs: List[str]):
        inputs = self.tokenizer(
            pairs, 
            padding=False, 
            truncation='longest_first',
            return_attention_mask=False, 
            max_length=self.max_length - len(self.prefix_tokens) - len(self.suffix_tokens)
        )
        for i, ele in enumerate(inputs['input_ids']):
            inputs['input_ids'][i] = self.prefix_tokens + ele + self.suffix_tokens
        
        inputs = self.tokenizer.pad(inputs, padding=True, return_tensors="pt", max_length=self.max_length)
        for key in inputs:
            inputs[key] = inputs[key].to(self.device)
        return inputs

    @torch.no_grad()
    def compute_scores(self, inputs) -> List[float]:
        batch_scores = self.model(**inputs).logits[:, -1, :]
        true_vector = batch_scores[:, self.token_true_id]
        false_vector = batch_scores[:, self.token_false_id]
        batch_scores = torch.stack([false_vector, true_vector], dim=1)
        batch_scores = torch.nn.functional.log_softmax(batch_scores, dim=1)
        scores = batch_scores[:, 1].exp().tolist()
        return scores

    def rerank(self, query: str, documents: List[str], top_k: int = 10, instruction: str = None, batch_size: int = 2) -> List[Tuple[int, float]]:
        print(f"Reranking {len(documents)} documents for query")
        if instruction is None:
            instruction = 'Given a patent query, retrieve relevant patent documents that are similar to the query'
        
        pairs = [self.format_instruction(instruction, query, doc) for doc in documents]
        all_scores = []
        
        for i in range(0, len(pairs), batch_size):
            batch_pairs = pairs[i:i + batch_size]
            try:
                inputs = self.process_inputs(batch_pairs)
                batch_scores = self.compute_scores(inputs)
                all_scores.extend(batch_scores)
                del inputs
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
            except RuntimeError as e:
                if "out of memory" in str(e).lower():
                    print(f"CUDA OOM in reranking batch {i//batch_size + 1}, using fallback scores")
                    all_scores.extend([0.1] * len(batch_pairs))
                    if torch.cuda.is_available():
                        torch.cuda.empty_cache()
                else:
                    raise e
        
        ranked_indices = np.argsort(all_scores)[::-1]
        return [(int(idx), float(all_scores[idx])) for idx in ranked_indices[:top_k]]
