import os
import yaml
import ast
import io
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
import fitz
import pymupdf4llm

from src.rag_system import PatentRAGSystem
import traceback
import re

def validate_and_format_patent_id(patent_id: str) -> str:
    clean_id = patent_id.strip().upper().replace("-", "")
    
    if clean_id.startswith("US"):
        clean_id = clean_id[2:]
    
    # Remove common suffixes like A1, A2, B1, B2, etc.
    import re
    clean_id = re.sub(r'[A-Z]\d*$', '', clean_id)
    
    base_url = "https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/"
    
    # Design patents (start with D, followed by 6-7 digits)
    if clean_id.startswith("D"):
        design_num = clean_id[1:]
        if design_num.isdigit() and 1 <= len(design_num) <= 7:
            # Pad to 6 digits for design patents
            formatted_num = design_num.zfill(6)
            return f"{base_url}D{formatted_num}"
        else:
            raise ValueError(f"Invalid design patent format: {patent_id}")
    
    # Plant patents (start with PP, followed by 5-6 digits)
    elif clean_id.startswith("PP"):
        plant_num = clean_id[2:]
        if plant_num.isdigit() and 1 <= len(plant_num) <= 6:
            # Pad to 5 digits for plant patents
            formatted_num = plant_num.zfill(5)
            return f"{base_url}PP{formatted_num}"
        else:
            raise ValueError(f"Invalid plant patent format: {patent_id}")
    
    # Published patent applications (format: YYYYNNNNNNN - year + 7 digits)
    elif len(clean_id) >= 8 and clean_id[:4].isdigit() and int(clean_id[:4]) >= 2001:
        year = clean_id[:4]
        app_num = clean_id[4:]
        if app_num.isdigit() and len(app_num) >= 4:
            formatted_app_num = app_num.zfill(7)
            return f"{base_url}{year}{formatted_app_num}"
        else:
            raise ValueError(f"Invalid published application format: {patent_id}")
    
    elif clean_id.isdigit():
        if len(clean_id) <= 7:
            formatted_num = clean_id.zfill(7)
            return f"{base_url}{formatted_num}"
        elif len(clean_id) == 8:
            return f"{base_url}{clean_id}"
        else:
            raise ValueError(f"Invalid utility patent format: {patent_id}")
    
    else:
        raise ValueError(f"Unrecognized patent ID format: {patent_id}")

def get_patent_type(patent_id: str) -> str:
    clean_id = patent_id.strip().upper().replace("-", "")
    
    if clean_id.startswith("US"):
        clean_id = clean_id[2:]
    
    # Remove common suffixes like A1, A2, B1, B2, etc.
    import re
    clean_id = re.sub(r'[A-Z]\d*$', '', clean_id)
    
    if clean_id.startswith("D"):
        return "design"
    elif clean_id.startswith("PP"):
        return "plant"
    elif len(clean_id) >= 8 and clean_id[:4].isdigit() and int(clean_id[:4]) >= 2001:
        return "application"
    elif clean_id.isdigit():
        return "utility"
    else:
        return "unknown"

def pdf_to_markdown(pdf_content: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_content, filetype="pdf")

        markdown_text = pymupdf4llm.to_markdown(doc)

        doc.close()

        try:
            with open('debug_request.txt', 'w', encoding='utf-8') as f:
                f.write(markdown_text)
                print("Debug: Response written to debug_request.txt")
        except Exception as e:
            print(f"Debug: Failed to write response to file: {e}")
        


        return markdown_text
        
    except Exception as e:
        print(f"Bytes verisi dönüştürülürken bir hata oluştu: {e}")
        return ""

class SearchRequest(BaseModel):
    query: str = Field(..., description="Search query for patents")
    top_k: int = Field(default=10, ge=1, le=100, description="Number of results to return")
    rerank: bool = Field(default=False, description="Enable reranking for better relevance")
    priority_year: Optional[int] = Field(default=None, description="Priority year for prior art analysis")
    granted_filter: Optional[bool] = Field(default=None, description="Filter by grant status: True for granted only, False for applications only, None for all")

class AnalysisRequest(BaseModel):
    patent_text: str = Field(..., description="Patent text to analyze")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of similar patents to find")
    rerank: bool = Field(default=True, description="Enable reranking for better relevance")
    priority_year: Optional[int] = Field(default=None, description="Priority year for prior art analysis")
    granted_filter: Optional[bool] = Field(default=None, description="Filter by grant status: True for granted only, False for applications only, None for all")

class PatentResult(BaseModel):
    rank: int
    document_id: str
    family_id: str
    title: str
    abstract: str
    relevance_score: float
    assignees: List[str]
    inventors: List[str] 
    cpc_codes: List[str]
    ipc_codes: List[str]
    technology_areas: List[str]
    technical_terms: List[str]
    method: str
    country_code: str
    filing_year: Optional[int]
    publication_year: Optional[int]
    priority_year: Optional[int]
    is_granted: bool
    metadata_summary: str
    citation_count: int
    citations_sample: List[str]
    is_valid_prior_art: bool
    temporal_relevance: str

class SearchResponse(BaseModel):
    query: str
    results: List[PatentResult]
    total_results: int

class AnalysisResponse(BaseModel):
    analysis: Any
    retrieved_documents: List[PatentResult]

class HealthResponse(BaseModel):
    status: str
    system_loaded: bool
    index_status: str

app = FastAPI(
    title="Patent RAG API",
    description="REST API for patent search and analysis using RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rag_system = None
system_config = None

def safe_parse_list(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = ast.literal_eval(value)
            if isinstance(parsed, list):
                return parsed
            else:
                return [str(parsed)]
        except (ValueError, SyntaxError):
            return [value] if value else []
    return [] if value is None else [str(value)]

def load_rag_system():
    global rag_system, system_config
    
    try:
        config_path = "config.yaml"
        if not os.path.exists(config_path):
            print(f"Configuration file not found: {config_path}")
            print("Please create a config.yaml file with the necessary configuration.")
            return False
        
        with open(config_path, 'r') as f:
            system_config = yaml.safe_load(f)
        
        print("Configuration loaded successfully")
        
        rag_system = PatentRAGSystem(system_config)
        
        index_prefix = system_config.get('index_save_prefix', 'patent_index')
        rag_system.load_index(index_prefix)
        
        print("RAG system loaded successfully")
        return True
    except FileNotFoundError as e:
        if "index" in str(e).lower():
            print(f"Index files not found: {e}")
            print("Please run 'python build_index.py' to build the patent indices first.")
        else:
            print(f"File not found: {e}")
        return False
    except Exception as e:
        print(f"Failed to load RAG system: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

@app.on_event("startup")
async def startup_event():
    success = load_rag_system()
    if not success:
        print("Warning: RAG system failed to load. Some endpoints may not work.")

@app.get("/", response_model=Dict[str, str])
async def root():
    return {
        "message": "Patent RAG API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    global rag_system
    
    system_loaded = rag_system is not None
    
    if system_loaded:
        index_status = "loaded"
        status = "healthy"
    else:
        index_status = "not_loaded - Please ensure config.yaml exists and indices are built"
        status = "degraded"
    
    return HealthResponse(
        status=status,
        system_loaded=system_loaded,
        index_status=index_status
    )

@app.post("/search", response_model=SearchResponse)
async def search_patents(request: SearchRequest):
    global rag_system
    
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not loaded")
    
    try:
        results = rag_system.retrieve(
            query=request.query,
            top_k=request.top_k,
            rerank=request.rerank,
            priority_year=request.priority_year,
            granted_filter=request.granted_filter
        )
        
        patent_results = []
        for result in results:
            if 'is_granted' in result:
                if isinstance(result['is_granted'], str):
                    val = result['is_granted'].strip().lower()
                    if val in ['true', '1', 'yes', 'y']:
                        result['is_granted'] = True
                    elif val in ['false', '0', 'no', 'n']:
                        result['is_granted'] = False
                    else:
                        result['is_granted'] = False
                elif not isinstance(result['is_granted'], bool):
                    result['is_granted'] = bool(result['is_granted'])
            patent_results.append(PatentResult(**result))
        
        return SearchResponse(
            query=request.query,
            results=patent_results,
            total_results=len(patent_results)
        )
    
    except Exception as e:
        print(f"Search failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/search", response_model=SearchResponse)
async def search_patents_get(
    query: str = Query(..., description="Search query for patents"),
    top_k: int = Query(default=10, ge=1, le=100, description="Number of results to return"),
    rerank: bool = Query(default=False, description="Enable reranking for better relevance"),
    priority_year: Optional[int] = Query(default=None, description="Priority year for prior art analysis"),
    granted_filter: Optional[bool] = Query(default=None, description="Filter by grant status: True for granted only, False for applications only, None for all")
):
    request = SearchRequest(query=query, top_k=top_k, rerank=rerank, priority_year=priority_year, granted_filter=granted_filter)
    return await search_patents(request)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_patent(
    pdf_file: Optional[UploadFile] = File(None),
    patent_text: str = Form(""),
    top_k: int = Form(5),
    rerank: bool = Form(True),
    priority_year: Optional[int] = Form(None),
    granted_filter: Optional[bool] = Form(None)
):
    """Analyze patent with optional PDF file upload and text input."""
    global rag_system
    
    if rag_system is None:
        raise HTTPException(status_code=503, detail="RAG system not loaded")
    
    try:
        combined_text = ""
        
        if pdf_file:
            if not pdf_file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400, detail="Only PDF files are supported")
            
            pdf_content = await pdf_file.read()
            pdf_markdown = pdf_to_markdown(pdf_content)
            combined_text += pdf_markdown
        
        if patent_text.strip():
            if combined_text:
                combined_text += "\n\n## Additional Text\n\n" + patent_text
            else:
                combined_text = patent_text
        
        if not combined_text.strip():
            raise HTTPException(status_code=400, detail="Either PDF file or patent text must be provided")
        
        try:
            with open('debug_request.txt', 'w', encoding='utf-8') as f:
                f.write(combined_text)
                print("Debug: Response written to debug_request.txt")
        except Exception as e:
            print(f"Debug: Failed to write response to file: {e}")

        analysis_result = rag_system.analyze_patent(
            patent_text=combined_text,
            top_k=top_k,
            rerank=rerank,
            priority_year=priority_year,
            granted_filter=granted_filter
        )
        
        if "error" in analysis_result:
            raise HTTPException(status_code=404, detail=analysis_result["error"])
        
        patent_results = []
        for doc in analysis_result["retrieved_documents"]:
            if 'is_granted' in doc:
                if isinstance(doc['is_granted'], str):
                    val = doc['is_granted'].strip().lower()
                    if val in ['true', '1', 'yes', 'y']:
                        doc['is_granted'] = True
                    elif val in ['false', '0', 'no', 'n']:
                        doc['is_granted'] = False
                    else:
                        doc['is_granted'] = False
                elif not isinstance(doc['is_granted'], bool):
                    doc['is_granted'] = bool(doc['is_granted'])
            patent_results.append(PatentResult(**doc))
        
        return AnalysisResponse(
            analysis=analysis_result["analysis"],
            retrieved_documents=patent_results
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Analysis failed: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/config", response_model=Dict[str, Any])
async def get_config():
    global system_config
    
    if system_config is None:
        raise HTTPException(status_code=503, detail="System not configured")
    
    safe_config = {
        "models": system_config.get("models", {}),
        "embedding_dims": system_config.get("embedding_dims", {}),
        "retrieval": system_config.get("retrieval", {}),
        "llm_backend": system_config.get("llm_config", {}).get("backend", "transformers"),
        "llm_model": _get_llm_model_name(system_config),
        "indexing": {
            "max_text_length": system_config.get("indexing", {}).get("max_text_length")
        }
    }
    
    return safe_config

@app.get("/patent_pdf/{patent_id}")
async def get_patent_pdf(patent_id: str):
    try:
        pdf_url = validate_and_format_patent_id(patent_id)
        patent_type = get_patent_type(patent_id)
        
        return RedirectResponse(
            url=pdf_url,
            status_code=302,
            headers={
                "X-Patent-Type": patent_type,
                "X-Patent-ID": patent_id
            }
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid patent ID format: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing patent ID: {str(e)}"
        )

def _get_llm_model_name(config):
    llm_config = config.get("llm_config", {})
    backend = llm_config.get("backend", "transformers")
    
    if backend == "llamacpp":
        llamacpp_config = llm_config.get("llamacpp", {})
        return f"{llamacpp_config.get('repo_id', 'Unknown')}/{llamacpp_config.get('filename', 'Unknown')}"
    else:
        transformers_config = llm_config.get("transformers", {})
        return transformers_config.get("model", "Unknown")

if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
