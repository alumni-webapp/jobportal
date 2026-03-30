import json
import asyncio
import anthropic


def match_job_with_resume(resume_data: dict, job: dict, api_key: str) -> dict:
    """Match a single job against resume data using Claude API."""
    try:
        client = anthropic.Anthropic(api_key=api_key)

        user_content = (
            f"Resume:\n{json.dumps(resume_data, indent=2)}\n\n"
            f"Job Title: {job.get('title', '')}\n"
            f"Job Description: {job.get('description', '')}\n"
            f"Job Requirements: {job.get('requirements', '')}"
        )

        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=(
                "You are a job matching expert. Given a resume and job posting, "
                "evaluate the match. Return ONLY a valid JSON object with: "
                "match_score (0-100 integer), match_reason (1 concise sentence), "
                "missing_skills (array of max 3 strings). Return ONLY the JSON, "
                "no markdown."
            ),
            messages=[
                {
                    "role": "user",
                    "content": user_content,
                }
            ],
        )

        response_text = message.content[0].text.strip()

        # Handle markdown code blocks
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            response_text = "\n".join(lines).strip()

        parsed = json.loads(response_text)
        return {
            "match_score": parsed.get("match_score", 50),
            "match_reason": parsed.get("match_reason", ""),
            "missing_skills": parsed.get("missing_skills", []),
        }

    except Exception as e:
        return {
            "match_score": 50,
            "match_reason": "Could not analyze",
            "missing_skills": [],
        }


async def _match_single_job(
    semaphore: asyncio.Semaphore,
    resume_data: dict,
    job: dict,
    api_key: str,
) -> dict:
    """Match a single job with semaphore-based concurrency control."""
    async with semaphore:
        try:
            # Run the synchronous Claude call in a thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, match_job_with_resume, resume_data, job, api_key
            )
            job_with_match = {**job, **result}
            return job_with_match
        except Exception:
            job_with_match = {
                **job,
                "match_score": 50,
                "match_reason": "Could not analyze",
                "missing_skills": [],
            }
            return job_with_match


async def match_jobs_batch(
    resume_data: dict, jobs: list, api_key: str
) -> list:
    """
    Match multiple jobs against resume data concurrently.
    Uses a semaphore to limit to 5 concurrent requests with 500ms delays.
    """
    semaphore = asyncio.Semaphore(5)
    tasks = []

    for i, job in enumerate(jobs):
        task = asyncio.create_task(
            _match_single_job(semaphore, resume_data, job, api_key)
        )
        tasks.append(task)
        # Add delay between launching batches of 5
        if (i + 1) % 5 == 0 and i + 1 < len(jobs):
            await asyncio.sleep(0.5)

    results = await asyncio.gather(*tasks, return_exceptions=True)

    matched_jobs = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            job_with_match = {
                **jobs[i],
                "match_score": 50,
                "match_reason": "Could not analyze",
                "missing_skills": [],
            }
            matched_jobs.append(job_with_match)
        else:
            matched_jobs.append(result)

    # Sort by match_score descending
    matched_jobs.sort(key=lambda x: x.get("match_score", 0), reverse=True)

    return matched_jobs
