# AI Resume Analyzer & Multi-Template Resume Builder

> **A modern full-stack MERN + Python AI platform** that parses resumes (PDF/DOCX), evaluates ATS readability scores, optimizes bullet points with the Google XYZ formula, and renders your structured resume data across **7 professional, ATS-optimized templates** with instant zero-loss switching.

---

## 🌟 Key Features

1. **Decoupled Architecture (Content Separate from Design)**
   - Resume content is stored as a standardized JSON schema.
   - Switch between all 7 templates in real time with **zero data loss**.
   - Customize color themes, typography, and density on the fly.

2. **Template Selection Gallery (7 Built-in Designs)**
   - **Classic ATS**: Single-column, standard typography, 98% ATS parseability score. Best for software developers, freshers, and corporate applications.
   - **Modern Professional**: Accent banner, two-column contact info, highlight tags. Best for experienced developers and tech leads.
   - **Minimalist**: Swiss-inspired typography, generous whitespace, pristine readability.
   - **Executive**: Refined serif headings, prestige borders, prominent executive profile. Best for senior directors, VPs, and managers.
   - **Creative**: Distinctive two-column sidebar layout with portfolio badges. Best for designers, UI/UX, and direct email applications.
   - **Technical**: Features a dedicated Technical Stack Matrix (Languages, Frameworks, Cloud, Databases) with GitHub badges.
   - **Academic**: Formal scholarly format with research statements, appointments, and publications.

3. **High-Accuracy Resume Parsing**
   - Extracts contact info, summaries, experience, bullets, education, and skills from **PDF**, **DOCX**, and **TXT** files.
   - Powered by **PyMuPDF** (`pymupdf`) and **python-docx** with Gemini API / OpenAI API integration and offline heuristic fallback.

4. **AI-Powered Bullet Optimizer**
   - Transforms weak bullet points using the **Google XYZ Formula**: *"Accomplished [X] as measured by [Y], by doing [Z]"*.
   - Generates 3 quantifiable variations per bullet point with 1-click replacement.

5. **ATS Score Analysis & Job Description Matcher**
   - Instant ATS score out of 100 with sub-scores: Completeness, Impact Metrics, Industry Keywords, and Formatting.
   - Job Description Tailoring: Paste any job posting to compute compatibility %, identify missing keywords, and synthesize a tailored executive summary.

6. **High-Fidelity Multi-Format Export**
   - **Vector PDF Export**: Selectable text, crisp vector fonts, exact A4 page margins.
   - **Word DOCX Export**: Real `.docx` binary generated via `python-docx` matching the chosen template style.
   - **JSON State Backup**: Export and import resume schemas locally.

---

## 📐 Technology Stack

| Layer | Technologies | Responsibilities |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Zustand | Interactive template gallery, split-view editor, live preview pane, PDF print engine |
| **Backend API** | Node.js, Express.js, TypeScript, Multer, Mongoose (MongoDB) | REST API, resume versions CRUD, upload handling, AI gateway |
| **AI Microservice** | Python 3.12, FastAPI, PyMuPDF, python-docx, Pydantic, Gemini API | PDF/DOCX parsing, ATS scoring algorithm, bullet rewriter, DOCX document builder |
| **Database** | MongoDB (with auto-fallback in-memory store) | Persistent storage for resumes, versions, and template styling |

---

## 🚀 Quick Start (Single-Command Run)

### 1. Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+
- **MongoDB** running locally on port 27017 (optional; automatic in-memory fallback included)

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Run Everything (Frontend + Backend + AI Service)
```bash
npm run dev
```

The services will start concurrently:
- 🌐 **Web Client**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **Express Server**: [http://localhost:5000](http://localhost:5000)
- 🧠 **Python AI Service**: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🔑 Environment Variables (Optional)

Create a `.env` file in `ai-service/`:
```env
# Optional: Enable Google Gemini for AI parsing and bullet improvements
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Enable OpenAI
OPENAI_API_KEY="your-openai-api-key"
```
*(Note: The system includes a deterministic offline NLP parser and optimizer that works 100% out of the box even without API keys!)*

---

## 📄 Standardized Resume JSON Schema
```json
{
  "personalInfo": {
    "fullName": "Alex Rivera",
    "jobTitle": "Senior Full Stack & Cloud Architect",
    "email": "alex.rivera@example.com",
    "phone": "+1 (555) 234-5678",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/alexrivera-tech",
    "github": "https://github.com/alexrivera-io"
  },
  "summary": "Results-driven Senior Full Stack Engineer with 7+ years of experience...",
  "experience": [
    {
      "id": "exp-1",
      "company": "Stripe",
      "role": "Lead Software Engineer",
      "startDate": "2022",
      "endDate": "Present",
      "current": true,
      "bullets": [
        "Architected an event-driven payment transaction engine processing $42M+ daily volume."
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "UC Berkeley",
      "degree": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2013",
      "endDate": "2017",
      "gpa": "3.88 / 4.0"
    }
  ],
  "skills": {
    "languages": ["TypeScript", "Python", "Go"],
    "frameworks": ["React", "Next.js", "Node.js", "FastAPI"],
    "tools": ["Docker", "Kubernetes", "AWS", "MongoDB", "Redis"]
  },
  "projects": [],
  "certifications": []
}
```

