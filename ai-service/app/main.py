from fastapi import FastAPI, UploadFile, File, Query, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import os

from .models import (
    ResumeSchema,
    AtsScoreBreakdown,
    BulletImproveRequest,
    BulletImproveResponse,
    TailorRequest,
    TailorResponse
)
from .parser import parse_document
from .extractor import extract_resume_data
from .analyzer import analyze_resume_ats, improve_bullet_point, tailor_resume_to_job
from .docx_builder import generate_resume_docx

app = FastAPI(
    title="AI Resume Analyzer & Builder Service",
    description="Python microservice powered by PyMuPDF, python-docx, and AI models for parsing, scoring, and generating resumes.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "ai-resume-fastapi",
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY"))
    }

@app.post("/api/parse", response_model=ResumeSchema)
async def parse_resume_file(file: UploadFile = File(...)):
    """
    Accepts PDF or DOCX resume, parses text with PyMuPDF/python-docx,
    and extracts structured JSON schema.
    """
    try:
        file_bytes = await file.read()
        parsed = parse_document(file_bytes, file.filename or "resume.pdf")
        resume_data = extract_resume_data(parsed["text"], parsed["lines"])
        return resume_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")

@app.post("/api/analyze-ats", response_model=AtsScoreBreakdown)
def analyze_ats(resume: ResumeSchema):
    """
    Computes ATS score, keyword coverage, impact metrics, strengths and actionable improvements.
    """
    try:
        return analyze_resume_ats(resume)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.post("/api/improve-bullet", response_model=BulletImproveResponse)
def improve_bullet(req: BulletImproveRequest):
    """
    Transforms weak bullet points into high-impact Google XYZ formula bullets.
    """
    try:
        return improve_bullet_point(req.bullet, req.role or "Software Engineer")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization error: {str(e)}")

@app.post("/api/tailor", response_model=TailorResponse)
def tailor_resume(req: TailorRequest):
    """
    Tailors resume to a specific job description, calculating match score and missing keywords.
    """
    try:
        return tailor_resume_to_job(req.resume, req.jobDescription)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tailoring error: {str(e)}")

@app.post("/api/generate-docx")
def create_docx(resume: ResumeSchema, template: str = Query("classic-ats")):
    """
    Generates a downloadable DOCX document formatted according to selected template.
    """
    try:
        docx_bytes = generate_resume_docx(resume, template)
        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename=resume_{template}.docx"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DOCX generation failed: {str(e)}")

