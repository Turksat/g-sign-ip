import os
import gc
import json
import yaml
import argparse
import torch
import pandas as pd
from tqdm import tqdm

# Adjust the path to import from the src directory
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.rag_system import PatentRAGSystem
from src.data_structures import PatentDocument

blacklist = {"auto_detected": [], "manual_blacklist": []}

def load_blacklist(blacklist_file):
    global blacklist
    if os.path.exists(blacklist_file):
        with open(blacklist_file, 'r') as f:
            existing = json.load(f)
            blacklist["auto_detected"] = existing.get("auto_detected", [])
            blacklist["manual_blacklist"] = existing.get("manual_blacklist", [])

def save_blacklist(blacklist_file):
    with open(blacklist_file, 'w') as f:
        json.dump(blacklist, f, indent=2)

def add_to_blacklist(publication_number, reason, blacklist_file):
    entry = {
        "publication_number": publication_number,
        "reason": reason,
        "timestamp": pd.Timestamp.now().isoformat()
    }
    if publication_number not in [item["publication_number"] for item in blacklist["auto_detected"]]:
        blacklist["auto_detected"].append(entry)
        save_blacklist(blacklist_file)
        print(f"Added {publication_number} to blacklist (Reason: {reason})")

def is_blacklisted(publication_number):
    if publication_number in blacklist["manual_blacklist"]:
        return True
    return any(item.get("publication_number") == publication_number for item in blacklist["auto_detected"])

def save_checkpoint(stage_num, processed_docs, total_processed, checkpoint_file):
    checkpoint = {
        'stage': stage_num,
        'processed_docs_in_stage': processed_docs,
        'total_processed': total_processed,
        'timestamp': pd.Timestamp.now().isoformat()
    }
    with open(checkpoint_file, 'w') as f:
        json.dump(checkpoint, f, indent=2)
    print(f"Checkpoint saved: Stage {stage_num}, Total processed {total_processed}")

def load_checkpoint(checkpoint_file):
    if os.path.exists(checkpoint_file):
        with open(checkpoint_file, 'r') as f:
            return json.load(f)
    return None

def main(config_path: str):
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    patent_data_file = config['patent_data_file']
    index_save_prefix = config['index_save_prefix']
    checkpoint_file = config['checkpoint_file']
    blacklist_file = config['blacklist_file']
    total_docs_to_process = config['indexing']['total_docs']
    docs_per_stage = config['indexing']['docs_per_stage']
    max_text_length = config['indexing']['max_text_length']

    load_blacklist(blacklist_file)

    checkpoint = load_checkpoint(checkpoint_file)
    start_from_doc = 0
    current_stage = 1

    if checkpoint:
        start_from_doc = checkpoint['total_processed']
        current_stage = checkpoint['stage'] + 1
        print(f"Resuming from Stage {current_stage} at document {start_from_doc}")
    else:
        print("Starting new indexing process.")

    rag_system = PatentRAGSystem(config)

    if checkpoint:
        try:
            rag_system.load_index(index_save_prefix)
        except FileNotFoundError:
            print("Could not load existing indices, starting fresh.")

    remaining_docs = total_docs_to_process - start_from_doc
    stages_needed = (remaining_docs + docs_per_stage - 1) // docs_per_stage
    
    main_pbar = tqdm(total=total_docs_to_process, desc="Total Progress", initial=start_from_doc)

    for stage in range(stages_needed):
        stage_num = current_stage + stage
        stage_start = start_from_doc + (stage * docs_per_stage)
        stage_end = min(stage_start + docs_per_stage, total_docs_to_process)
        stage_size = stage_end - stage_start

        print(f"\n--- STAGE {stage_num}: Processing docs {stage_start} to {stage_end-1} ---")
        
        df_stage = pd.read_csv(patent_data_file, skiprows=range(1, stage_start + 1), nrows=stage_size)
        
        stage_documents = []
        for _, row in tqdm(df_stage.iterrows(), total=len(df_stage), desc="Preparing Documents"):
            pub_num = str(row.get('publication_number', ''))
            if is_blacklisted(pub_num):
                continue
            
            doc = PatentDocument(**{k: str(row.get(k, '')) for k in PatentDocument.__annotations__})
            
            searchable_text = doc.get_searchable_text()
            if len(searchable_text) > max_text_length:
                add_to_blacklist(doc.publication_number, "Too large document", blacklist_file)
                continue
            if len(searchable_text.strip()) < 50:
                add_to_blacklist(doc.publication_number, "Too short document", blacklist_file)
                continue
                
            stage_documents.append(doc)

        print("\nProcessing with Primary Embedder (Qwen3)")
        for i in tqdm(range(0, len(stage_documents), 50), desc="Qwen3 Embedding"):
            chunk_docs = stage_documents[i:i + 50]
            texts = [rag_system.preprocessor.clean_patent_text(d.get_searchable_text()) for d in chunk_docs]
            try:
                embeddings = rag_system.qwen3_embedder.encode(texts, batch_size=2)
                rag_system.primary_store.add_documents(chunk_docs, embeddings)
            except RuntimeError as e:
                if "out of memory" in str(e).lower():
                    print(f"OOM error in Qwen3 processing chunk starting at {i}. Skipping.")
                    for doc in chunk_docs:
                        add_to_blacklist(doc.publication_number, "CUDA_OOM_Qwen3", blacklist_file)
                else: raise e
            finally:
                del embeddings, texts, chunk_docs; gc.collect(); torch.cuda.empty_cache()

        print("\nProcessing with Secondary Embedder (PatentSBERTa)")
        for i in tqdm(range(0, len(stage_documents), 200), desc="SBERTa Embedding"):
            chunk_docs = stage_documents[i:i + 200]
            texts = [rag_system.preprocessor.clean_patent_text(d.get_searchable_text()) for d in chunk_docs]
            try:
                embeddings = rag_system.patent_sberta.encode(texts, batch_size=8)
                rag_system.secondary_store.add_documents(chunk_docs, embeddings)
            except RuntimeError as e:
                if "out of memory" in str(e).lower():
                    print(f"OOM error in SBERTa processing chunk starting at {i}. Skipping.")
                    for doc in chunk_docs:
                        add_to_blacklist(doc.publication_number, "CUDA_OOM_SBERTa", blacklist_file)
                else: raise e
            finally:
                del embeddings, texts, chunk_docs; gc.collect(); torch.cuda.empty_cache()

        print("\nSaving indices...")
        rag_system.primary_store.save_index(f"{index_save_prefix}_primary")
        rag_system.secondary_store.save_index(f"{index_save_prefix}_secondary")
        
        total_processed = stage_end
        save_checkpoint(stage_num, stage_size, total_processed, checkpoint_file)
        main_pbar.update(stage_size)

    main_pbar.close()
    print("\nAll stages completed successfully!")
    if os.path.exists(checkpoint_file):
        os.remove(checkpoint_file)
        print("Checkpoint file removed.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build FAISS indices for the Patent RAG system.")
    parser.add_argument("--config", type=str, default="config.yaml", help="Path to the configuration file.")
    args = parser.parse_args()
    main(args.config)
