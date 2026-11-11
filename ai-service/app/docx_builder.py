import io
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from .models import ResumeSchema

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def generate_resume_docx(resume: ResumeSchema, template_id: str = "classic-ats") -> bytes:
    doc = Document()
    
    # Configure 0.6 inch margins for clean professional printable layout
    for section in doc.sections:
        section.top_margin = Inches(0.6)
        section.bottom_margin = Inches(0.6)
        section.left_margin = Inches(0.65)
        section.right_margin = Inches(0.65)
        
    p_info = resume.personalInfo

    # Primary colors based on template
    primary_rgb = RGBColor(15, 23, 42) # Slate 900
    if template_id == "modern-pro":
        primary_rgb = RGBColor(2, 132, 199) # Sky 600
    elif template_id == "creative":
        primary_rgb = RGBColor(124, 58, 237) # Violet 600
    elif template_id == "technical":
        primary_rgb = RGBColor(13, 148, 136) # Teal 600
    elif template_id == "executive":
        primary_rgb = RGBColor(30, 41, 59) # Slate 800

    # 1. Header (Name & Title)
    name_p = doc.add_paragraph()
    name_p.alignment = WD_ALIGN_PARAGRAPH.CENTER if template_id in ["classic-ats", "executive", "academic"] else WD_ALIGN_PARAGRAPH.LEFT
    name_run = name_p.add_run(p_info.fullName.upper())
    name_run.font.size = Pt(20)
    name_run.font.bold = True
    name_run.font.color.rgb = primary_rgb
    name_p.paragraph_format.space_after = Pt(2)
    name_p.paragraph_format.space_before = Pt(0)

    # Subtitle
    if p_info.jobTitle:
        title_p = doc.add_paragraph()
        title_p.alignment = name_p.alignment
        title_run = title_p.add_run(p_info.jobTitle)
        title_run.font.size = Pt(12)
        title_run.font.italic = True
        title_run.font.color.rgb = RGBColor(71, 85, 105)
        title_p.paragraph_format.space_after = Pt(4)

    # Contact line
    contacts = []
    if p_info.email: contacts.append(p_info.email)
    if p_info.phone: contacts.append(p_info.phone)
    if p_info.location: contacts.append(p_info.location)
    if p_info.linkedin: contacts.append(p_info.linkedin.replace("https://", ""))
    if p_info.github: contacts.append(p_info.github.replace("https://", ""))

    contact_p = doc.add_paragraph()
    contact_p.alignment = name_p.alignment
    contact_run = contact_p.add_run("  •  ".join(contacts))
    contact_run.font.size = Pt(9.5)
    contact_run.font.color.rgb = RGBColor(100, 116, 139)
    contact_p.paragraph_format.space_after = Pt(12)

    def add_section_header(title: str):
        hp = doc.add_paragraph()
        hp.paragraph_format.space_before = Pt(10)
        hp.paragraph_format.space_after = Pt(4)
        run = hp.add_run(title.upper())
        run.font.bold = True
        run.font.size = Pt(11)
        run.font.color.rgb = primary_rgb

    # 2. Professional Summary
    if resume.summary and resume.visibleSections.get("summary", True):
        add_section_header("Professional Summary")
        sp = doc.add_paragraph()
        s_run = sp.add_run(resume.summary)
        s_run.font.size = Pt(10)
        sp.paragraph_format.space_after = Pt(6)

    # 3. Work Experience
    if resume.experience and resume.visibleSections.get("experience", True):
        add_section_header("Work Experience")
        for exp in resume.experience:
            role_p = doc.add_paragraph()
            role_p.paragraph_format.space_before = Pt(4)
            role_p.paragraph_format.space_after = Pt(2)
            
            # Role & Company
            r_run = role_p.add_run(exp.role)
            r_run.font.bold = True
            r_run.font.size = Pt(10.5)
            
            c_run = role_p.add_run(f" | {exp.company}")
            c_run.font.size = Pt(10.5)
            c_run.font.color.rgb = primary_rgb
            
            dates_str = f"  ({exp.startDate} – {exp.endDate})"
            d_run = role_p.add_run(dates_str)
            d_run.font.italic = True
            d_run.font.size = Pt(9.5)
            d_run.font.color.rgb = RGBColor(100, 116, 139)

            for bullet in exp.bullets:
                bp = doc.add_paragraph(style='List Bullet')
                bp.paragraph_format.space_before = Pt(1)
                bp.paragraph_format.space_after = Pt(2)
                b_run = bp.add_run(bullet)
                b_run.font.size = Pt(9.5)

    # 4. Technical Skills
    if resume.visibleSections.get("skills", True):
        sk = resume.skills
        if sk.languages or sk.frameworks or sk.tools or sk.softSkills:
            add_section_header("Skills & Competencies")
            
            categories = [
                ("Languages", sk.languages),
                ("Frameworks & Libraries", sk.frameworks),
                ("Cloud, Databases & Tools", sk.tools),
                ("Professional Competencies", sk.softSkills)
            ]
            for label, items in categories:
                if items:
                    p = doc.add_paragraph()
                    p.paragraph_format.space_before = Pt(1)
                    p.paragraph_format.space_after = Pt(2)
                    lbl_run = p.add_run(f"{label}: ")
                    lbl_run.font.bold = True
                    lbl_run.font.size = Pt(9.5)
                    val_run = p.add_run(", ".join(items))
                    val_run.font.size = Pt(9.5)

    # 5. Projects
    if resume.projects and resume.visibleSections.get("projects", True):
        add_section_header("Key Projects")
        for proj in resume.projects:
            pp = doc.add_paragraph()
            pp.paragraph_format.space_before = Pt(4)
            pp.paragraph_format.space_after = Pt(1)
            
            p_name = pp.add_run(proj.name)
            p_name.font.bold = True
            p_name.font.size = Pt(10)
            
            if proj.technologies:
                tech_run = pp.add_run(f" [{', '.join(proj.technologies)}]")
                tech_run.font.size = Pt(9)
                tech_run.font.color.rgb = RGBColor(100, 116, 139)

            if proj.description:
                dp = doc.add_paragraph()
                dp.paragraph_format.space_before = Pt(0)
                dp.paragraph_format.space_after = Pt(2)
                dp_run = dp.add_run(proj.description)
                dp_run.font.size = Pt(9.5)

            for b in proj.bullets:
                bp = doc.add_paragraph(style='List Bullet')
                bp.paragraph_format.space_before = Pt(1)
                bp.paragraph_format.space_after = Pt(1)
                b_run = bp.add_run(b)
                b_run.font.size = Pt(9.5)

    # 6. Education
    if resume.education and resume.visibleSections.get("education", True):
        add_section_header("Education")
        for edu in resume.education:
            ep = doc.add_paragraph()
            ep.paragraph_format.space_before = Pt(3)
            ep.paragraph_format.space_after = Pt(1)
            
            d_run = ep.add_run(f"{edu.degree} in {edu.fieldOfStudy}")
            d_run.font.bold = True
            d_run.font.size = Pt(10)
            
            inst_run = ep.add_run(f" | {edu.institution}")
            inst_run.font.size = Pt(10)
            
            date_run = ep.add_run(f"  ({edu.startDate} – {edu.endDate})")
            date_run.font.italic = True
            date_run.font.size = Pt(9.5)
            date_run.font.color.rgb = RGBColor(100, 116, 139)

    # 7. Certifications
    if resume.certifications and resume.visibleSections.get("certifications", True):
        add_section_header("Certifications & Licenses")
        for cert in resume.certifications:
            cp = doc.add_paragraph(style='List Bullet')
            cp.paragraph_format.space_before = Pt(1)
            cp.paragraph_format.space_after = Pt(2)
            c_name = cp.add_run(cert.name)
            c_name.font.bold = True
            c_name.font.size = Pt(9.5)
            if cert.issuer:
                c_iss = cp.add_run(f" – {cert.issuer} ({cert.date})")
                c_iss.font.size = Pt(9.5)

    out = io.BytesIO()
    doc.save(out)
    return out.getvalue()
