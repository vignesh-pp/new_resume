import io
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from .models import ResumeSchema

def add_p_bottom_border(paragraph, color_hex="1E3A8A", sz="12"):
    """Adds a native XML bottom border line under the paragraph."""
    pPr = paragraph._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), sz)  # 12 = 1.5pt, 16 = 2pt
    bottom.set(qn('w:space'), '4')
    bottom.set(qn('w:color'), color_hex)
    pBdr.append(bottom)
    pPr.append(pBdr)

def generate_resume_docx(resume: ResumeSchema, template_id: str = "classic-ats") -> bytes:
    doc = Document()
    
    # Configure 0.6 inch margins for clean professional layout
    for section in doc.sections:
        section.top_margin = Inches(0.6)
        section.bottom_margin = Inches(0.6)
        section.left_margin = Inches(0.65)
        section.right_margin = Inches(0.65)
        
    p_info = resume.personalInfo

    # Primary colors & fonts matching UI templates
    color_map = {
        "classic-ats": ("1E3A8A", RGBColor(30, 58, 138), "Calibri"),
        "modern-pro": ("0284C7", RGBColor(2, 132, 199), "Arial"),
        "creative": ("7C3AED", RGBColor(124, 58, 237), "Century Gothic"),
        "technical": ("0D9488", RGBColor(13, 148, 136), "Consolas"),
        "executive": ("1E293B", RGBColor(30, 41, 59), "Garamond"),
        "minimalist": ("475569", RGBColor(71, 85, 105), "Calibri"),
        "academic": ("111827", RGBColor(17, 24, 39), "Times New Roman"),
    }
    primary_hex, primary_rgb, font_family = color_map.get(
        template_id, ("1E3A8A", RGBColor(30, 58, 138), "Calibri")
    )

    # Set base font family on document default style
    style = doc.styles['Normal']
    font = style.font
    font.name = font_family

    # 1. Header (Name & Title)
    name_p = doc.add_paragraph()
    name_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if template_id in ["classic-ats", "executive", "academic"] else WD_ALIGN_PARAGRAPH.LEFT
    name_run = name_p.add_run(p_info.fullName.upper())
    name_run.font.size = Pt(20)
    name_run.font.bold = True
    name_run.font.color.rgb = primary_rgb
    name_p.paragraph_format.space_after = Pt(2)
    name_p.paragraph_format.space_before = Pt(0)

    # Subtitle / Job Title
    if p_info.jobTitle:
        title_p = doc.add_paragraph()
        title_p.alignment = name_p.alignment
        title_run = title_p.add_run(p_info.jobTitle)
        title_run.font.size = Pt(11)
        title_run.font.italic = True
        title_run.font.color.rgb = RGBColor(71, 85, 105)
        title_p.paragraph_format.space_after = Pt(3)

    # Contact line
    contacts = []
    if p_info.email: contacts.append(p_info.email)
    if p_info.phone: contacts.append(p_info.phone)
    if p_info.location: contacts.append(p_info.location)
    if p_info.linkedin: contacts.append(p_info.linkedin.replace("https://", ""))
    if p_info.github: contacts.append(p_info.github.replace("https://", ""))
    if p_info.website: contacts.append(p_info.website.replace("https://", ""))

    contact_p = doc.add_paragraph()
    contact_p.alignment = name_p.alignment
    contact_run = contact_p.add_run("  •  ".join(contacts))
    contact_run.font.size = Pt(9.5)
    contact_run.font.color.rgb = RGBColor(100, 116, 139)
    contact_p.paragraph_format.space_after = Pt(8)
    # Add crisp divider under header
    add_p_bottom_border(contact_p, color_hex=primary_hex, sz="12")

    def add_section_header(title: str):
        hp = doc.add_paragraph()
        hp.paragraph_format.space_before = Pt(8)
        hp.paragraph_format.space_after = Pt(3)
        hp.paragraph_format.keep_with_next = True  # Prevents orphan headings
        run = hp.add_run(title.upper())
        run.font.bold = True
        run.font.size = Pt(11)
        run.font.color.rgb = primary_rgb
        add_p_bottom_border(hp, color_hex=primary_hex, sz="12")
        return hp

    def render_summary():
        if resume.summary and resume.visibleSections.get("summary", True):
            title = resume.sectionTitles.get("summary", "Professional Summary")
            add_section_header(title)
            sp = doc.add_paragraph()
            s_run = sp.add_run(resume.summary)
            s_run.font.size = Pt(10)
            sp.paragraph_format.space_after = Pt(4)

    def render_experience():
        if resume.experience and resume.visibleSections.get("experience", True):
            title = resume.sectionTitles.get("experience", "Work Experience")
            add_section_header(title)
            for exp in resume.experience:
                role_p = doc.add_paragraph()
                role_p.paragraph_format.space_before = Pt(4)
                role_p.paragraph_format.space_after = Pt(1)
                role_p.paragraph_format.keep_with_next = True
                
                r_run = role_p.add_run(exp.role)
                r_run.font.bold = True
                r_run.font.size = Pt(10)
                
                c_run = role_p.add_run(f" | {exp.company}")
                c_run.font.size = Pt(10)
                c_run.font.color.rgb = primary_rgb
                
                if exp.location:
                    loc_run = role_p.add_run(f" ({exp.location})")
                    loc_run.font.size = Pt(9)
                    loc_run.font.color.rgb = RGBColor(100, 116, 139)

                dates_str = f"  ({exp.startDate} – {exp.endDate})"
                d_run = role_p.add_run(dates_str)
                d_run.font.italic = True
                d_run.font.size = Pt(9)
                d_run.font.color.rgb = RGBColor(100, 116, 139)

                for bullet in exp.bullets:
                    bp = doc.add_paragraph(style='List Bullet')
                    bp.paragraph_format.space_before = Pt(1)
                    bp.paragraph_format.space_after = Pt(1)
                    b_run = bp.add_run(bullet)
                    b_run.font.size = Pt(9.5)

    def render_skills():
        if resume.visibleSections.get("skills", True):
            sk = resume.skills
            if sk.languages or sk.frameworks or sk.tools or sk.softSkills or sk.technical:
                title = resume.sectionTitles.get("skills", "Skills & Competencies")
                add_section_header(title)
                
                categories = [
                    ("Languages", sk.languages),
                    ("Frameworks & Libraries", sk.frameworks),
                    ("Cloud, Databases & Tools", sk.tools),
                    ("Technical Skills", sk.technical),
                    ("Competencies", sk.softSkills)
                ]
                for label, items in categories:
                    if items:
                        p = doc.add_paragraph()
                        p.paragraph_format.space_before = Pt(1)
                        p.paragraph_format.space_after = Pt(1)
                        lbl_run = p.add_run(f"{label}: ")
                        lbl_run.font.bold = True
                        lbl_run.font.size = Pt(9.5)
                        val_run = p.add_run(", ".join(items))
                        val_run.font.size = Pt(9.5)

    def render_projects():
        if resume.projects and resume.visibleSections.get("projects", True):
            title = resume.sectionTitles.get("projects", "Projects")
            add_section_header(title)
            for proj in resume.projects:
                pp = doc.add_paragraph()
                pp.paragraph_format.space_before = Pt(3)
                pp.paragraph_format.space_after = Pt(1)
                pp.paragraph_format.keep_with_next = True
                
                p_name = pp.add_run(proj.name)
                p_name.font.bold = True
                p_name.font.size = Pt(10)
                
                if proj.technologies:
                    tech_run = pp.add_run(f" | {', '.join(proj.technologies)}")
                    tech_run.font.size = Pt(9)
                    tech_run.font.color.rgb = RGBColor(100, 116, 139)

                if proj.url:
                    u_run = pp.add_run(f" ({proj.url})")
                    u_run.font.size = Pt(8.5)
                    u_run.font.color.rgb = primary_rgb

                if proj.description:
                    dp = doc.add_paragraph()
                    dp.paragraph_format.space_before = Pt(0)
                    dp.paragraph_format.space_after = Pt(1)
                    dp_run = dp.add_run(proj.description)
                    dp_run.font.size = Pt(9.5)

                for b in proj.bullets:
                    bp = doc.add_paragraph(style='List Bullet')
                    bp.paragraph_format.space_before = Pt(1)
                    bp.paragraph_format.space_after = Pt(1)
                    b_run = bp.add_run(b)
                    b_run.font.size = Pt(9.5)

    def render_education():
        if resume.education and resume.visibleSections.get("education", True):
            title = resume.sectionTitles.get("education", "Education")
            add_section_header(title)
            for edu in resume.education:
                ep = doc.add_paragraph()
                ep.paragraph_format.space_before = Pt(2)
                ep.paragraph_format.space_after = Pt(1)
                ep.paragraph_format.keep_with_next = True
                
                d_run = ep.add_run(f"{edu.degree} in {edu.fieldOfStudy}")
                d_run.font.bold = True
                d_run.font.size = Pt(10)
                
                inst_run = ep.add_run(f" — {edu.institution}")
                inst_run.font.size = Pt(10)

                if edu.location:
                    l_run = ep.add_run(f" ({edu.location})")
                    l_run.font.size = Pt(9)
                    l_run.font.color.rgb = RGBColor(100, 116, 139)
                
                date_run = ep.add_run(f"  ({edu.startDate} – {edu.endDate})")
                date_run.font.italic = True
                date_run.font.size = Pt(9)
                date_run.font.color.rgb = RGBColor(100, 116, 139)

                if edu.gpa:
                    gp = doc.add_paragraph()
                    gp.paragraph_format.space_before = Pt(0)
                    gp.paragraph_format.space_after = Pt(1)
                    g_run = gp.add_run(f"GPA: {edu.gpa}")
                    g_run.font.size = Pt(9)
                    g_run.font.color.rgb = RGBColor(100, 116, 139)

    def render_certifications():
        if resume.certifications and resume.visibleSections.get("certifications", True):
            title = resume.sectionTitles.get("certifications", "Certifications")
            add_section_header(title)
            for cert in resume.certifications:
                cp = doc.add_paragraph(style='List Bullet')
                cp.paragraph_format.space_before = Pt(1)
                cp.paragraph_format.space_after = Pt(1)
                c_name = cp.add_run(cert.name)
                c_name.font.bold = True
                c_name.font.size = Pt(9.5)
                if cert.issuer:
                    c_iss = cp.add_run(f" — {cert.issuer}")
                    c_iss.font.size = Pt(9.5)
                if cert.date:
                    c_dt = cp.add_run(f" ({cert.date})")
                    c_dt.font.size = Pt(9)
                    c_dt.font.color.rgb = RGBColor(100, 116, 139)

    def render_custom_section(cs_id: str):
        if resume.visibleSections.get(cs_id, True):
            matching = [cs for cs in resume.customSections if cs.id == cs_id]
            if not matching:
                return
            cs = matching[0]
            title = resume.sectionTitles.get(cs.id, cs.title)
            add_section_header(title)
            for it in cs.items:
                ip = doc.add_paragraph()
                ip.paragraph_format.space_before = Pt(2)
                ip.paragraph_format.space_after = Pt(1)
                ip.paragraph_format.keep_with_next = True
                
                t_run = ip.add_run(it.title)
                t_run.font.bold = True
                t_run.font.size = Pt(10)
                
                if it.subtitle:
                    s_run = ip.add_run(f" — {it.subtitle}")
                    s_run.font.italic = True
                    s_run.font.size = Pt(9.5)
                
                if it.date:
                    d_run = ip.add_run(f" ({it.date})")
                    d_run.font.italic = True
                    d_run.font.size = Pt(9)
                    d_run.font.color.rgb = RGBColor(100, 116, 139)

                if it.description:
                    dp = doc.add_paragraph()
                    dp.paragraph_format.space_before = Pt(0)
                    dp.paragraph_format.space_after = Pt(1)
                    d_run = dp.add_run(it.description)
                    d_run.font.size = Pt(9.5)

                if it.bullets:
                    for b in it.bullets:
                        bp = doc.add_paragraph(style='List Bullet')
                        bp.paragraph_format.space_before = Pt(1)
                        bp.paragraph_format.space_after = Pt(1)
                        b_run = bp.add_run(b)
                        b_run.font.size = Pt(9.5)

    section_renderers = {
        "summary": render_summary,
        "experience": render_experience,
        "skills": render_skills,
        "projects": render_projects,
        "education": render_education,
        "certifications": render_certifications,
    }

    # Follow sectionOrder from UI
    rendered_custom = set()
    for sec_id in resume.sectionOrder:
        if sec_id in section_renderers:
            section_renderers[sec_id]()
        elif any(cs.id == sec_id for cs in resume.customSections):
            render_custom_section(sec_id)
            rendered_custom.add(sec_id)

    # Any custom sections not explicitly in sectionOrder
    for cs in resume.customSections:
        if cs.id not in rendered_custom:
            render_custom_section(cs.id)

    out = io.BytesIO()
    doc.save(out)
    return out.getvalue()
