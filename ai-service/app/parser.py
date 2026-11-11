import io
from typing import Dict, Any, List
try:
    import pymupdf as fitz
except ImportError:
    import fitz
from docx import Document

def extract_text_from_pdf(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts text, metadata, and block structure from PDF bytes using PyMuPDF.
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    full_text_pages: List[str] = []
    lines: List[str] = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        full_text_pages.append(text)
        for line in text.splitlines():
            stripped = line.strip()
            if stripped:
                lines.append(stripped)
                
    doc.close()
    
    raw_text = "\n".join(full_text_pages)
    return {
        "text": raw_text,
        "lines": lines,
        "page_count": len(full_text_pages)
    }

def extract_text_from_docx(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts text, paragraphs, and tables from DOCX bytes using python-docx.
    """
    doc_io = io.BytesIO(file_bytes)
    doc = Document(doc_io)
    lines: List[str] = []
    
    for p in doc.paragraphs:
        txt = p.text.strip()
        if txt:
            lines.append(txt)
            
    # Also extract any table content
    for table in doc.tables:
        for row in table.rows:
            row_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_texts:
                lines.append(" | ".join(row_texts))
                
    raw_text = "\n".join(lines)
    return {
        "text": raw_text,
        "lines": lines,
        "page_count": 1
    }

def parse_document(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif lower_name.endswith(".docx") or lower_name.endswith(".doc"):
        return extract_text_from_docx(file_bytes)
    elif lower_name.endswith(".txt"):
        text = file_bytes.decode("utf-8", errors="replace")
        return {
            "text": text,
            "lines": [l.strip() for l in text.splitlines() if l.strip()],
            "page_count": 1
        }
    else:
        # Default try pdf then utf-8
        try:
            return extract_text_from_pdf(file_bytes)
        except Exception:
            text = file_bytes.decode("utf-8", errors="replace")
            return {
                "text": text,
                "lines": [l.strip() for l in text.splitlines() if l.strip()],
                "page_count": 1
            }
