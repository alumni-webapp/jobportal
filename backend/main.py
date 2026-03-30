import os
import json
import uuid
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from models import init_db, SessionLocal, ResumeSession
from resume_parser import extract_text_from_pdf, extract_text_from_docx, parse_resume_with_claude
from job_fetcher import fetch_jobs
from job_matcher import match_jobs_batch
from resume_generator import generate_tailored_resume
from mock_data import (
    MOCK_RESUME_PARSED, MOCK_JOBS,
    mock_match_score, mock_tailored_resume,
)

# Load environment variables from ../.env
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

# Initialize database
init_db()

app = FastAPI(title="AI Job Portal", version="1.0.0")


def _is_demo_mode() -> bool:
    """Check if running in demo mode (no API keys configured)."""
    return not os.getenv("ANTHROPIC_API_KEY", "")

# CORS middleware - allow localhost and Codespaces domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request bodies
class FetchJobsRequest(BaseModel):
    skills: list[str] = []
    preferred_roles: list[str] = []


class MatchJobsRequest(BaseModel):
    resume_data: dict
    jobs: list[dict]


class GenerateResumeRequest(BaseModel):
    resume_data: dict
    job_description: str
    job_title: str


def _get_anthropic_key() -> str:
    """Get the Anthropic API key from environment."""
    key = os.getenv("ANTHROPIC_API_KEY", "")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured. Please set it in the .env file.",
        )
    return key


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "demo_mode": _is_demo_mode(),
    }


@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse a resume file (PDF or DOCX)."""
    try:
        # Read file content
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # Demo mode: return mock parsed resume
        if _is_demo_mode():
            return {
                "session_id": str(uuid.uuid4()),
                "filename": file.filename,
                "parsed_data": MOCK_RESUME_PARSED,
                "demo_mode": True,
            }

        api_key = _get_anthropic_key()

        # Extract text based on content type or filename
        content_type = file.content_type or ""
        filename = (file.filename or "").lower()

        if "pdf" in content_type or filename.endswith(".pdf"):
            text = extract_text_from_pdf(file_bytes)
        elif (
            "wordprocessingml" in content_type
            or "msword" in content_type
            or filename.endswith(".docx")
            or filename.endswith(".doc")
        ):
            text = extract_text_from_docx(file_bytes)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {content_type}. Please upload a PDF or DOCX file.",
            )

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract any text from the uploaded file.",
            )

        # Parse with Claude
        parsed_data = parse_resume_with_claude(text, api_key)

        # Save session to database
        session_id = str(uuid.uuid4())
        try:
            db = SessionLocal()
            resume_session = ResumeSession(
                session_id=session_id,
                filename=file.filename,
                parsed_data=json.dumps(parsed_data),
            )
            db.add(resume_session)
            db.commit()
            db.close()
        except Exception:
            pass  # Non-critical: don't fail the request if DB save fails

        return {
            "session_id": session_id,
            "filename": file.filename,
            "parsed_data": parsed_data,
        }

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process resume: {str(e)}",
        )


@app.post("/api/fetch-jobs")
async def fetch_jobs_endpoint(request: FetchJobsRequest):
    """Fetch jobs based on skills and preferred roles."""
    try:
        config = {
            "adzuna_app_id": os.getenv("ADZUNA_APP_ID", ""),
            "adzuna_app_key": os.getenv("ADZUNA_APP_KEY", ""),
            "rapidapi_key": os.getenv("RAPIDAPI_KEY", ""),
        }

        # Check if any job API is configured
        has_adzuna = config["adzuna_app_id"] and config["adzuna_app_key"]
        has_jsearch = bool(config["rapidapi_key"])

        # Demo mode: return mock jobs
        if not has_adzuna and not has_jsearch:
            return {"jobs": MOCK_JOBS, "count": len(MOCK_JOBS), "demo_mode": True}

        jobs = await fetch_jobs(request.skills, request.preferred_roles, config)

        return {"jobs": jobs, "count": len(jobs)}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch jobs: {str(e)}",
        )


@app.post("/api/match-jobs")
async def match_jobs_endpoint(request: MatchJobsRequest):
    """Match jobs against resume data using AI analysis."""
    try:
        if not request.jobs:
            return {"matched_jobs": [], "count": 0}

        # Demo mode: use mock matching
        if _is_demo_mode():
            skills = request.resume_data.get("skills", [])
            matched = []
            for job in request.jobs:
                match_result = mock_match_score(skills, job)
                matched.append({**job, **match_result})
            matched.sort(key=lambda x: x["match_score"], reverse=True)
            return {"matched_jobs": matched, "count": len(matched), "demo_mode": True}

        api_key = _get_anthropic_key()

        matched_jobs = await match_jobs_batch(
            request.resume_data, request.jobs, api_key
        )

        return {"matched_jobs": matched_jobs, "count": len(matched_jobs)}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to match jobs: {str(e)}",
        )


@app.post("/api/generate-resume")
async def generate_resume_endpoint(request: GenerateResumeRequest):
    """Generate a tailored resume for a specific job."""
    try:
        if not request.job_description or not request.job_title:
            raise HTTPException(
                status_code=400,
                detail="Both job_description and job_title are required.",
            )

        # Demo mode: use mock resume generator
        if _is_demo_mode():
            tailored = mock_tailored_resume(
                request.resume_data,
                request.job_title,
                request.job_description,
            )
            return {"tailored_resume": tailored, "demo_mode": True}

        api_key = _get_anthropic_key()

        tailored_resume = generate_tailored_resume(
            request.resume_data,
            request.job_description,
            request.job_title,
            api_key,
        )

        if "error" in tailored_resume:
            raise HTTPException(
                status_code=500,
                detail=tailored_resume["error"],
            )

        return {"tailored_resume": tailored_resume}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate tailored resume: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
