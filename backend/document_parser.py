import fitz  # PyMuPDF
import docx

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text content from a PDF file."""
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text content from a DOCX file."""
    import io
    doc = docx.Document(io.BytesIO(file_bytes))
    full_text = [para.text for para in doc.paragraphs if para.text.strip()]
    return "\n".join(full_text)

def parse_uploaded_file(file_name: str, file_bytes: bytes) -> str:
    """Detects file extension and extracts text."""
    extension = file_name.split(".")[-1].lower()
    if extension == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif extension in ["docx", "doc"]:
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")