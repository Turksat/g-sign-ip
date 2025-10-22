import os
import sys
import yaml
import argparse
import pandas as pd

# Adjust the path to import from the src directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.rag_system import PatentRAGSystem

def display_retrieval_results(results: list):
    if not results:
        print("No results found.")
        return
    df = pd.DataFrame([
        {
            'Rank': r['rank'], 'Patent ID': r['document_id'], 'Title': r['title'],
            'Score': f"{r['relevance_score']:.4f}", 'Method': r['method']
        } for r in results
    ])
    print(df.to_string())

def display_analysis_results(results: dict):
    print("\n--- COMPREHENSIVE ANALYSIS REPORT ---")
    
    print("\n--- LLM Analysis ---")
    print(results['analysis'])
    
    print("\n--- Top Retrieved Prior Art ---")
    display_retrieval_results(results['retrieved_documents'])

def main(args):
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)

    if args.file:
        try:
            with open(args.file, 'r') as f:
                query_text = f.read()
        except FileNotFoundError:
            print(f"Error: Input file not found at {args.file}")
            return
    else:
        query_text = args.query

    rag_system = PatentRAGSystem(config)
    try:
        rag_system.load_index(config['index_save_prefix'])
    except FileNotFoundError:
        print("Error: Index files not found. Please run 'build_index.py' first.")
        return

    if args.analyze:
        analysis_results = rag_system.analyze_patent(query_text, top_k=args.top_k, rerank=args.rerank)
        if "error" in analysis_results:
            print(f"Analysis failed: {analysis_results['error']}")
        else:
            display_analysis_results(analysis_results)
    else:
        retrieval_results = rag_system.retrieve(query_text, top_k=args.top_k, rerank=args.rerank)
        display_retrieval_results(retrieval_results)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Query or analyze patents with the RAG system.")
    parser.add_argument("--config", type=str, default="config.yaml", help="Path to the config file.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-q", "--query", type=str, help="The search query or patent text.")
    group.add_argument("-f", "--file", type=str, help="Path to a file containing the patent text.")
    parser.add_argument("-k", "--top_k", type=int, default=5, help="Number of results to retrieve.")
    parser.add_argument("--rerank", action='store_true', help="Enable the reranking stage.")
    parser.add_argument("--analyze", action='store_true', help="Run the full RAG+LLM analysis pipeline.")
    
    args = parser.parse_args()
    main(args)
