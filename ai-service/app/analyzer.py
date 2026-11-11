import re
import os
import json
from typing import List, Dict, Any, Tuple
from .models import ResumeSchema, AtsScoreBreakdown, BulletImproveResponse, TailorResponse

ACTION_VERBS = {
    "architected", "spearheaded", "engineered", "orchestrated", "accelerated",
    "scaled", "optimized", "implemented", "delivered", "mentored", "automated",
    "streamlined", "transformed", "designed", "revamped", "reduced", "increased"
}

POPULAR_TECH_KEYWORDS = {
    "react", "typescript", "javascript", "python", "node.js", "express",
    "fastapi", "docker", "kubernetes", "aws", "gcp", "azure", "mongodb",
    "postgresql", "graphql", "rest api", "microservices", "ci/cd", "redis",
    "system design", "tailwind", "next.js", "agile", "tdd", "git"
}

def analyze_resume_ats(resume: ResumeSchema) -> AtsScoreBreakdown:
    completeness_pts = 0
    impact_pts = 0
    keywords_pts = 0
    formatting_pts = 0
    
    strengths: List[str] = []
    improvements: List[str] = []
    
    # 1. Check completeness (Max 25 pts)
    p = resume.personalInfo
    if p.fullName and len(p.fullName) > 2:
        completeness_pts += 4
    if p.email and "@" in p.email:
        completeness_pts += 4
    if p.phone:
        completeness_pts += 4
    if p.linkedin:
        completeness_pts += 4
    if resume.summary and len(resume.summary) > 40:
        completeness_pts += 4
        strengths.append("Contains a well-articulated professional summary")
    else:
        improvements.append("Add a 2-3 sentence executive summary to highlight your top achievements")
        
    if resume.experience and len(resume.experience) > 0:
        completeness_pts += 5
    else:
        improvements.append("Add at least one relevant work experience or internship")
        
    # 2. Check impact & metrics in bullets (Max 25 pts)
    all_bullets: List[str] = []
    for exp in resume.experience:
        all_bullets.extend(exp.bullets)
    for prj in resume.projects:
        all_bullets.extend(prj.bullets)
        
    metric_count = 0
    strong_verb_count = 0
    number_pattern = re.compile(r'(\d+[\d,]*%?|\$\d+[\d,]*|\d+x|\d+\+)', re.I)
    
    for bullet in all_bullets:
        if number_pattern.search(bullet):
            metric_count += 1
        first_word = bullet.strip().split(" ")[0].lower() if bullet.strip() else ""
        if first_word in ACTION_VERBS or first_word.endswith("ed"):
            strong_verb_count += 1
            
    if metric_count >= 5:
        impact_pts = 25
        strengths.append(f"Strong quantifiable impact: {metric_count} metrics/KPIs detected")
    elif metric_count >= 2:
        impact_pts = 18
        improvements.append("Increase quantifiable metrics (percentages, speedups, user counts) across experience bullets")
    else:
        impact_pts = 8
        improvements.append("Crucial: Add quantifiable results (e.g. 'boosted performance by 35%') to your achievements")
        
    if strong_verb_count >= 4:
        strengths.append(f"Great use of power action verbs ({strong_verb_count}+ instances)")
        
    # 3. Check Keywords & Technical Depth (Max 25 pts)
    resume_text_blob = f"{resume.summary} " + " ".join(all_bullets) + " "
    resume_text_blob += " ".join(resume.skills.languages + resume.skills.frameworks + resume.skills.tools + resume.skills.technical).lower()
    
    detected_keywords: List[str] = []
    missing_keywords: List[str] = []
    
    for kw in POPULAR_TECH_KEYWORDS:
        if kw in resume_text_blob:
            detected_keywords.append(kw)
        else:
            missing_keywords.append(kw)
            
    kw_coverage = len(detected_keywords) / len(POPULAR_TECH_KEYWORDS)
    if kw_coverage >= 0.5:
        keywords_pts = 25
        strengths.append(f"Comprehensive keyword footprint ({len(detected_keywords)} high-demand industry skills)")
    elif kw_coverage >= 0.3:
        keywords_pts = 19
        improvements.append("Consider incorporating more cloud and architectural keywords (e.g. AWS, CI/CD, Microservices)")
    else:
        keywords_pts = 12
        improvements.append("Technical keywords are low. Ensure industry frameworks and cloud tools are listed")
        
    # 4. Check Formatting & Structure (Max 25 pts)
    formatting_pts = 25
    if len(resume.education) == 0:
        formatting_pts -= 5
        improvements.append("Include your degree or educational credentials")
    if len(all_bullets) < 4:
        formatting_pts -= 5
        improvements.append("Provide at least 3-4 descriptive bullet points per key role")
    if not resume.skills.languages and not resume.skills.frameworks:
        formatting_pts -= 5
        improvements.append("Group your skills into distinct categories (Languages, Frameworks, Tools) for ATS parsers")
        
    total_score = min(100, completeness_pts + impact_pts + keywords_pts + formatting_pts)
    
    return AtsScoreBreakdown(
        overallScore=total_score,
        completenessScore=min(25, completeness_pts),
        impactMetricsScore=impact_pts,
        keywordsScore=keywords_pts,
        formattingScore=formatting_pts,
        strengths=strengths,
        improvements=improvements,
        detectedKeywords=detected_keywords[:15],
        missingKeywords=missing_keywords[:8]
    )

def improve_bullet_point(bullet: str, role: str = "Software Engineer") -> BulletImproveResponse:
    """
    Rewrites a bullet point using the Google XYZ Formula:
    "Accomplished [X] as measured by [Y], by doing [Z]"
    Uses LLM if available, otherwise heuristic optimization.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            Improve the following resume bullet point for a {role}.
            Follow the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.
            Provide 3 high-impact, professional variations with strong action verbs and realistic quantifiable metrics.
            Original bullet: "{bullet}"
            
            Return JSON in this format:
            {{
              "suggestions": [
                "Variation 1...",
                "Variation 2...",
                "Variation 3..."
              ],
              "reasoning": "Brief explanation of changes"
            }}
            """
            resp = model.generate_content(prompt)
            clean_json = resp.text.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            data = json.loads(clean_json)
            return BulletImproveResponse(
                original=bullet,
                suggestions=data.get("suggestions", []),
                reasoning=data.get("reasoning", "Enhanced action verbs and metric clarity.")
            )
        except Exception as e:
            print(f"Gemini bullet improvement fallback: {e}")

    # Heuristic variations
    cleaned = bullet.strip().rstrip('.')
    # Remove weak starter
    weak_starters = ["worked on", "responsible for", "helped with", "assisted in", "did", "handled"]
    core_text = cleaned
    for ws in weak_starters:
        if core_text.lower().startswith(ws):
            core_text = core_text[len(ws):].strip()
            break
            
    v1 = f"Architected and deployed {core_text}, boosting operational throughput by 32% and reducing system latency."
    v2 = f"Spearheaded {core_text} across multi-functional engineering teams, delivering the release 2 weeks ahead of schedule."
    v3 = f"Optimized {core_text} leveraging modern cloud best practices, resulting in a 40% reduction in infrastructure costs."
    
    return BulletImproveResponse(
        original=bullet,
        suggestions=[v1, v2, v3],
        reasoning="Transformed passive description into results-oriented achievements highlighting measurable impact and leadership."
    )

def tailor_resume_to_job(resume: ResumeSchema, job_description: str) -> TailorResponse:
    """
    Compares the resume against the target job description to compute match score and recommendations.
    """
    jd_lower = job_description.lower()
    
    # Identify matching and missing keywords
    matching: List[str] = []
    missing: List[str] = []
    
    resume_blob = f"{resume.summary} "
    for exp in resume.experience:
        resume_blob += f"{exp.role} {exp.company} " + " ".join(exp.bullets) + " "
    resume_blob += " ".join(resume.skills.languages + resume.skills.frameworks + resume.skills.tools + resume.skills.technical).lower()
    
    # Check key technical tokens
    potential_techs = [
        "react", "typescript", "node.js", "python", "golang", "java", "aws", "docker",
        "kubernetes", "graphql", "microservices", "mongodb", "postgresql", "sql", "redis",
        "ci/cd", "agile", "next.js", "tailwind", "rest api", "unit testing", "system architecture"
    ]
    
    relevant_in_jd = [tech for tech in potential_techs if tech in jd_lower]
    if not relevant_in_jd:
        relevant_in_jd = ["typescript", "react", "node.js", "aws", "docker", "agile"]
        
    for tech in relevant_in_jd:
        if tech in resume_blob:
            matching.append(tech)
        else:
            missing.append(tech)
            
    match_ratio = len(matching) / max(1, len(relevant_in_jd))
    match_score = int(min(98, max(45, match_ratio * 100)))
    
    tailored_summary = (
        f"Accomplished {resume.personalInfo.jobTitle or 'Software Engineer'} with deep expertise in "
        f"{', '.join(matching[:3]) if matching else 'full-stack systems'}. Proven track record of architecting scalable applications, "
        f"optimizing distributed systems, and collaborating in high-velocity agile environments to exceed business objectives."
    )
    
    recommendations = [
        f"Highlight experience with missing keywords: {', '.join(missing[:3]) if missing else 'cloud containerization'} in your experience section.",
        "Align top 3 bullet points with the core competencies mentioned in the job description.",
        "Mirror exact terminology (e.g. 'Microservices Architecture', 'CI/CD Pipelines') from the requirements."
    ]
    
    return TailorResponse(
        matchScore=match_score,
        matchingKeywords=matching,
        missingKeywords=missing,
        tailoredSummary=tailored_summary,
        recommendedChanges=recommendations
    )

