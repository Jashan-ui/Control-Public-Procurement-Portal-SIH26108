import os
import traceback
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Google GenAI SDK
from google import genai
from google.genai import types

# Local document parsing helper
from document_parser import parse_uploaded_file

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI App
app = FastAPI(
    title="BIS Recommendation Engine API",
    description="Backend API for retrieving Bureau of Indian Standards (IS) recommendations concisely.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure GEMINI_API_KEY is available
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable is not set or missing from .env file.")

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else genai.Client()

# System Instruction: structured IS-standard format for technical queries,
# normal conversational answers for everything else
IS_SYSTEM_INSTRUCTION = """
You are a helpful engineering assistant with special expertise in Bureau of Indian Standards (IS standards).

Decide how to respond based on the user's question:

1. If the question is about IS standards, structural/material specifications, building codes, or construction/engineering criteria — respond using this structured markdown format:

## Overview
A 2-sentence paragraph introducing the standard, its purpose, and what it covers.

## Key Clauses & Parameters
- Point 1
- Point 2
- Point 3
- Point 4

## Application
A concise 1-2 sentence paragraph on practical implementation.

2. If the question is general (greetings, casual conversation, general knowledge, math, or anything unrelated to IS standards/engineering) — just answer normally and conversationally, in plain markdown. Do NOT force the Overview/Key Clauses/Application structure on non-technical questions.

General rules:
- Use markdown formatting (bullet points, bold, headings) where it genuinely helps readability.
- Keep responses concise and clear.
- Do NOT use LaTeX or dollar signs for variables (write Z, R, I instead of $Z$, $R$, $I$).
"""

# Primary model and fallback models (all current, active model IDs)
PRIMARY_MODEL = "gemini-3.5-flash-lite"
FALLBACK_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash"]


def generate_content_with_fallback(contents: str, max_tokens: int):
    """
    Attempts generation with the primary model first.
    If the model is unavailable, deprecated, or the quota/rate limit is hit,
    automatically retries using fallback models.
    """
    models_to_try = [PRIMARY_MODEL] + FALLBACK_MODELS
    last_exception = None

    for model in models_to_try:
        try:
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=IS_SYSTEM_INSTRUCTION,
                    temperature=0.2,
                    max_output_tokens=max_tokens,
                ),
            )
            return response.text
        except Exception as e:
            last_exception = e
            error_str = str(e)
            if (
                "503" in error_str
                or "UNAVAILABLE" in error_str
                or "429" in error_str
                or "RESOURCE_EXHAUSTED" in error_str
                or "404" in error_str
                or "NOT_FOUND" in error_str
            ):
                print(f"WARNING: Model {model} unavailable, quota exceeded, or deprecated. Trying fallback...")
                continue
            else:
                raise e

    raise last_exception


@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"status": "active", "message": "BIS Recommendation Engine API is running"}


@app.post("/analyze-query")
@app.post("/recommend")
async def analyze_query(query: str = None, user_query: str = None):
    """
    Accepts a user query regarding Indian Standards and returns a structured response.
    Supports both 'query' and 'user_query' parameters.
    """
    final_query = query or user_query

    if not final_query or not final_query.strip():
        raise HTTPException(status_code=400, detail="Query parameter cannot be empty.")

    try:
        result_text = generate_content_with_fallback(contents=final_query, max_tokens=1200)
        return {"recommendation": result_text}

    except Exception as e:
        print("--- EXCEPTION IN /analyze-query ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")


@app.post("/upload-document")
@app.post("/analyze-file")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts a PDF or Word document, parses its text, and generates a structured IS standard analysis.
    """
    try:
        file_bytes = await file.read()
        extracted_text = parse_uploaded_file(file.filename, file_bytes)

        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the provided document.")

        prompt = f"Analyze the following document text and provide relevant IS Standard recommendations:\n\n{extracted_text}"

        result_text = generate_content_with_fallback(contents=prompt, max_tokens=1500)

        return {
            "filename": file.filename,
            "analysis": result_text
        }

    except Exception as e:
        print("--- EXCEPTION IN /upload-document ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Document Error: {str(e)}")