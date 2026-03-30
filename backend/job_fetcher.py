import httpx
import urllib.parse
from typing import Optional


def _detect_work_type(description: str) -> str:
    """Detect work type from job description text."""
    desc_lower = (description or "").lower()
    if "remote" in desc_lower:
        return "Remote"
    elif "hybrid" in desc_lower:
        return "Hybrid"
    return "On-site"


def _build_query(skills: list, roles: list) -> str:
    """Build a search query string from skills and roles."""
    query_parts = []
    # Take top 3 skills
    if skills:
        query_parts.extend(skills[:3])
    # Take first preferred role
    if roles:
        query_parts.append(roles[0])
    return " ".join(query_parts)


async def fetch_jobs_from_adzuna(
    skills: list, roles: list, app_id: str, app_key: str
) -> list:
    """Fetch jobs from the Adzuna API."""
    query = _build_query(skills, roles)
    encoded_query = urllib.parse.quote(query)
    url = (
        f"https://api.adzuna.com/v1/api/jobs/us/search/1"
        f"?app_id={app_id}&app_key={app_key}"
        f"&results_per_page=30&what={encoded_query}"
    )

    jobs = []
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        results = data.get("results", [])
        for item in results:
            description = item.get("description", "")
            salary_min = item.get("salary_min")
            salary_max = item.get("salary_max")

            job = {
                "job_id": str(item.get("id", "")),
                "title": item.get("title", ""),
                "company": item.get("company", {}).get("display_name", "Unknown"),
                "location": item.get("location", {}).get("display_name", ""),
                "salary_min": salary_min,
                "salary_max": salary_max,
                "work_type": _detect_work_type(description),
                "description": description,
                "requirements": "",
                "url": item.get("redirect_url", ""),
                "company_logo": "",
                "date_posted": item.get("created", ""),
            }
            jobs.append(job)

    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"Adzuna API HTTP error: {e.response.status_code}")
    except httpx.RequestError as e:
        raise RuntimeError(f"Adzuna API request error: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Adzuna API error: {str(e)}")

    return jobs


async def fetch_jobs_from_jsearch(
    skills: list, roles: list, rapidapi_key: str
) -> list:
    """Fetch jobs from the JSearch API (RapidAPI)."""
    query = _build_query(skills, roles)
    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": rapidapi_key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    params = {
        "query": query,
        "page": "1",
        "num_pages": "1",
        "results_per_page": "30",
    }

    jobs = []
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

        results = data.get("data", [])
        for item in results:
            description = item.get("job_description", "")

            job = {
                "job_id": item.get("job_id", ""),
                "title": item.get("job_title", ""),
                "company": item.get("employer_name", "Unknown"),
                "location": f"{item.get('job_city', '')}, {item.get('job_state', '')}".strip(", "),
                "salary_min": item.get("job_min_salary"),
                "salary_max": item.get("job_max_salary"),
                "work_type": _detect_work_type(description),
                "description": description,
                "requirements": ", ".join(
                    item.get("job_required_skills") or []
                ) if item.get("job_required_skills") else "",
                "url": item.get("job_apply_link", ""),
                "company_logo": item.get("employer_logo", ""),
                "date_posted": item.get("job_posted_at_datetime_utc", ""),
            }
            jobs.append(job)

    except httpx.HTTPStatusError as e:
        raise RuntimeError(f"JSearch API HTTP error: {e.response.status_code}")
    except httpx.RequestError as e:
        raise RuntimeError(f"JSearch API request error: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"JSearch API error: {str(e)}")

    return jobs


async def fetch_jobs(skills: list, roles: list, config: dict) -> list:
    """
    Fetch jobs using the best available API based on provided config.

    config should contain relevant API keys:
      - adzuna_app_id, adzuna_app_key for Adzuna
      - rapidapi_key for JSearch
    """
    adzuna_app_id = config.get("adzuna_app_id")
    adzuna_app_key = config.get("adzuna_app_key")
    rapidapi_key = config.get("rapidapi_key")

    # Try Adzuna first
    if adzuna_app_id and adzuna_app_key:
        try:
            jobs = await fetch_jobs_from_adzuna(
                skills, roles, adzuna_app_id, adzuna_app_key
            )
            if jobs:
                return jobs
        except RuntimeError:
            pass  # Fall through to JSearch

    # Try JSearch as fallback
    if rapidapi_key:
        try:
            jobs = await fetch_jobs_from_jsearch(skills, roles, rapidapi_key)
            if jobs:
                return jobs
        except RuntimeError:
            pass

    # No API keys configured or both failed
    return []
