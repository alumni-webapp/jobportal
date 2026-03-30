import io
import json
import pdfplumber
from docx import Document
import anthropic


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")
    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text content from a DOCX file."""
    text = ""
    try:
        doc = Document(io.BytesIO(file_bytes))
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text += paragraph.text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to extract text from DOCX: {str(e)}")
    return text.strip()


def parse_resume_with_claude(text: str, api_key: str) -> dict:
    """Parse resume text using Claude API and return structured data."""
    try:
        client = anthropic.Anthropic(api_key=api_key)

        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            system="You are a resume parser. Extract and return ONLY a valid JSON object with keys: name, email, skills (array), experience_years (number), job_titles (array of past titles), education (array), preferred_roles (array), summary (string). Return ONLY the JSON, no markdown.",
            messages=[
                {
                    "role": "user",
                    "content": text,
                }
            ],
        )

        response_text = message.content[0].text.strip()

        # Handle cases where response might be wrapped in markdown code blocks
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            # Remove first and last lines (``` markers)
            lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            response_text = "\n".join(lines).strip()

        parsed = json.loads(response_text)
        return parsed

    except json.JSONDecodeError as e:
        return {
            "error": f"Failed to parse Claude response as JSON: {str(e)}",
            "raw_response": response_text if "response_text" in dir() else "",
            "name": "",
            "email": "",
            "skills": [],
            "experience_years": 0,
            "job_titles": [],
            "education": [],
            "preferred_roles": [],
            "summary": "",
        }
    except anthropic.APIError as e:
        return {
            "error": f"Claude API error: {str(e)}",
            "name": "",
            "email": "",
            "skills": [],
            "experience_years": 0,
            "job_titles": [],
            "education": [],
            "preferred_roles": [],
            "summary": "",
        }
    except Exception as e:
        return {
            "error": f"Unexpected error parsing resume: {str(e)}",
            "name": "",
            "email": "",
            "skills": [],
            "experience_years": 0,
            "job_titles": [],
            "education": [],
            "preferred_roles": [],
            "summary": "",
        }
