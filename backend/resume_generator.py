import json
import anthropic


def generate_tailored_resume(
    resume_data: dict, job_description: str, job_title: str, api_key: str
) -> dict:
    """Generate a tailored, ATS-optimized resume using Claude API."""
    try:
        client = anthropic.Anthropic(api_key=api_key)

        user_content = (
            f"Here is the candidate's resume data:\n"
            f"{json.dumps(resume_data, indent=2)}\n\n"
            f"Here is the target job title:\n{job_title}\n\n"
            f"Here is the target job description:\n{job_description}\n\n"
            f"Please rewrite and tailor this resume for the above job."
        )

        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=(
                "You are an expert resume writer. Rewrite this resume to be "
                "ATS-optimized for the given job description. Tailor the summary, "
                "reorder skills, adjust bullet points in experience to mirror "
                "keywords from the JD. Return ONLY a valid JSON object with "
                "sections: name, contact (object with email, phone, linkedin), "
                "summary, skills (array), experience (array of {title, company, "
                "dates, bullets[]}), education (array of {degree, school, year}). "
                "Do NOT fabricate any new experience or companies. Return ONLY "
                "the JSON, no markdown."
            ),
            messages=[
                {
                    "role": "user",
                    "content": user_content,
                }
            ],
        )

        response_text = message.content[0].text.strip()

        # Handle cases where response might be wrapped in markdown code blocks
        if response_text.startswith("```"):
            lines = response_text.split("\n")
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
        }
    except anthropic.APIError as e:
        return {"error": f"Claude API error: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error generating resume: {str(e)}"}
