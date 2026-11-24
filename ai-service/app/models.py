from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PersonalInfo(BaseModel):
    fullName: str = "John Doe"
    jobTitle: str = "Full Stack Engineer"
    email: str = "john.doe@example.com"
    phone: str = "+1 (555) 019-2834"
    location: str = "San Francisco, CA"
    website: Optional[str] = "https://johndoe.dev"
    linkedin: Optional[str] = "https://linkedin.com/in/johndoe"
    github: Optional[str] = "https://github.com/johndoe"
    photoUrl: Optional[str] = None

class ExperienceItem(BaseModel):
    id: str
    company: str
    role: str
    location: Optional[str] = ""
    startDate: str
    endDate: str = "Present"
    current: bool = False
    bullets: List[str] = []

class EducationItem(BaseModel):
    id: str
    institution: str
    degree: str
    fieldOfStudy: str
    location: Optional[str] = ""
    startDate: str
    endDate: str
    gpa: Optional[str] = None
    highlights: Optional[List[str]] = []

class SkillsCategorized(BaseModel):
    technical: List[str] = []
    languages: List[str] = []
    frameworks: List[str] = []
    tools: List[str] = []
    softSkills: List[str] = []

class ProjectItem(BaseModel):
    id: str
    name: str
    description: str
    role: Optional[str] = None
    technologies: List[str] = []
    url: Optional[str] = None
    github: Optional[str] = None
    bullets: List[str] = []

class CertificationItem(BaseModel):
    id: str
    name: str
    issuer: str
    date: str
    url: Optional[str] = None

class CustomSectionItem(BaseModel):
    title: str
    subtitle: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    bullets: Optional[List[str]] = []

class CustomSection(BaseModel):
    id: str
    title: str
    items: List[CustomSectionItem] = []

class ResumeSchema(BaseModel):
    personalInfo: PersonalInfo = Field(default_factory=PersonalInfo)
    summary: str = ""
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    skills: SkillsCategorized = Field(default_factory=SkillsCategorized)
    projects: List[ProjectItem] = []
    certifications: List[CertificationItem] = []
    customSections: List[CustomSection] = []
    sectionOrder: List[str] = [
        "personal", "summary", "experience", "projects", "skills", "education", "certifications"
    ]
    visibleSections: Dict[str, bool] = {
        "summary": True,
        "experience": True,
        "projects": True,
        "skills": True,
        "education": True,
        "certifications": True,
    }
    sectionTitles: Dict[str, str] = {}

class AtsScoreBreakdown(BaseModel):
    overallScore: int
    completenessScore: int
    impactMetricsScore: int
    keywordsScore: int
    formattingScore: int
    strengths: List[str]
    improvements: List[str]
    detectedKeywords: List[str]
    missingKeywords: List[str]

class BulletImproveRequest(BaseModel):
    bullet: str
    role: Optional[str] = "Software Engineer"
    targetJobTitle: Optional[str] = None

class BulletImproveResponse(BaseModel):
    original: str
    suggestions: List[str]
    reasoning: str

class TailorRequest(BaseModel):
    resume: ResumeSchema
    jobDescription: str

class TailorResponse(BaseModel):
    matchScore: int
    matchingKeywords: List[str]
    missingKeywords: List[str]
    tailoredSummary: str
    recommendedChanges: List[str]

