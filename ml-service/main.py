import torch
import io
import json
import os
from fastapi import FastAPI, UploadFile, File
from PIL import Image
from transformers import AutoModelForImageTextToText, AutoProcessor, BitsAndBytesConfig
from fastapi.responses import JSONResponse

# --- Local Component Imports ---
from ingest_to_rag import markdown_to_hierarchy, save_to_knowledge_base
from rag_engine import LAHRag
from agent_logic import LegalDetective
from utils import extract_ulpin, lookup_ulpin_in_json

app = FastAPI()

# Configuration
MODEL_ID = "zai-org/GLM-OCR"
rag_engine = None

def refresh_rag_engine():
    """Reloads the FAISS index to include newly uploaded documents."""
    global rag_engine
    if os.path.exists("knowledge_base.json"):
        try:
            rag_engine = LAHRag("knowledge_base.json")
            print("🔄 RAG Search Engine Refreshed.")
        except Exception as e:
            print(f"⚠️ RAG Refresh failed (JSON might be malformed): {e}")

# --- SYSTEM INITIALIZATION ---
print("🧠 Initializing Sthir Labs AI Hub (GLM-OCR + RAG + Gemini Agent)...")

try:
    # 4-bit Quantization for RTX 3050 (4GB VRAM optimization)
    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
        llm_int8_enable_fp32_cpu_offload=True
    )

    model = AutoModelForImageTextToText.from_pretrained(
        MODEL_ID,
        quantization_config=quantization_config,
        device_map="auto",
        trust_remote_code=True
    ).eval()

    processor = AutoProcessor.from_pretrained(MODEL_ID, trust_remote_code=True)
    
    # Initialize RAG on startup
    refresh_rag_engine()
    
    print("✅ All Systems Online!")

except Exception as e:
    print(f"❌ System Initialization Failed: {e}")

# --- ENDPOINT 1: TRANSLITERATE, EXTRACT & INDEX ---
@app.post("/transliterate")
async def transliterate(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # 1. OCR PHASE (Handwritten to Markdown)
        messages = [{"role": "user", "content": [
            {"type": "image"},
            {"type": "text", "text": "Transcribe this historical document accurately. Use Markdown headers (#) for sections. Avoid repeating words."}
        ]}]
        
        prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
        inputs = processor(text=prompt, images=image, return_tensors="pt").to("cuda")

        with torch.no_grad():
            output = model.generate(
                **inputs, 
                max_new_tokens=1024, 
                do_sample=True,
                temperature=0.2,
                repetition_penalty=1.5,
                no_repeat_ngram_size=3
            )
        
        transcription = processor.decode(output[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)

        # 2. AUTO-EXTRACTION PHASE (ULPIN Detection)
        detected_ulpin = extract_ulpin(transcription)
        gov_data = None
        if detected_ulpin:
            gov_data = lookup_ulpin_in_json(detected_ulpin)
            print(f"🔎 Auto-detected ULPIN: {detected_ulpin}")

        # 3. HIERARCHICAL RAG INGESTION
        metadata = {
            "filename": file.filename, 
            "ulpin": detected_ulpin, 
            "gov_verified": True if gov_data else False
        }
        hierarchical_node = markdown_to_hierarchy(file.filename, transcription, metadata)
        save_to_knowledge_base(hierarchical_node)
        
        # Refresh RAG to make new data searchable
        refresh_rag_engine()
        
        torch.cuda.empty_cache()
        return {
            "doc_id": file.filename,
            "transcription": transcription,
            "detected_ulpin": detected_ulpin,
            "government_record": gov_data,
            "status": "Digitized and Indexed"
        }

    except Exception as e:
        print(f"❌ Transliterate Error: {e}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

# --- ENDPOINT 2: HIERARCHICAL SEARCH ---
@app.get("/ask")
async def ask_question(q: str):
    if not rag_engine:
        return {"error": "Knowledge base empty. Please upload a document first."}
    
    results = rag_engine.search(q, top_k=3)
    return {
        "query": q,
        "matches": [{"text": r['text'], "source": r['doc_id']} for r in results]
    }

# --- ENDPOINT 3: REASONING & VERDICT ---
@app.get("/verdict")
async def get_legal_verdict(doc_id: str, ulpin: str = None):
    try:
        # 1. Fetch Paper Context from RAG
        if not rag_engine: return {"error": "RAG not initialized"}
        context_nodes = rag_engine.search(f"Land details for {doc_id}")
        paper_context = "\n".join([n['text'] for n in context_nodes])

        # 2. Fetch Govt Data (Manual override or auto-lookup)
        gov_record = lookup_ulpin_in_json(ulpin) if ulpin else None
        
        # 3. Fetch Physical Data (Mocked for Phase 4)
        # In Phase 5, this will come from your 'calculate_area' logic
        physical_data = {"surveyed_area_acres": 2.05, "status": "Physical Survey Complete"}

        # 4. Agentic Reasoning (Gemini)
        detective = LegalDetective(paper_context, gov_record, physical_data)
        verdict_json = detective.generate_verdict()
        
        return json.loads(verdict_json)

    except Exception as e:
        return {"error": f"Verdict generation failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)