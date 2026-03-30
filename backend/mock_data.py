"""
Mock data for demo mode when no API keys are configured.
Allows the app to run fully without Anthropic or job search API keys.
"""

import random

MOCK_RESUME_PARSED = {
    "name": "Alex Johnson",
    "email": "alex.johnson@email.com",
    "skills": [
        "Python", "JavaScript", "React", "Node.js", "SQL",
        "AWS", "Docker", "Git", "REST APIs", "TypeScript",
        "PostgreSQL", "MongoDB"
    ],
    "experience_years": 5,
    "job_titles": [
        "Full Stack Developer",
        "Software Engineer",
        "Frontend Developer"
    ],
    "education": [
        {"degree": "B.S. Computer Science", "school": "State University", "year": "2019"}
    ],
    "preferred_roles": ["Software Engineer", "Full Stack Developer", "Backend Developer"],
    "summary": "Experienced full-stack developer with 5 years of experience building scalable web applications using Python, JavaScript, and cloud technologies. Strong background in React, Node.js, and AWS services."
}

MOCK_JOBS = [
    {
        "job_id": "demo-001",
        "title": "Senior Full Stack Developer",
        "company": "TechVista Solutions",
        "location": "San Francisco, CA",
        "salary_min": 140000,
        "salary_max": 180000,
        "work_type": "Remote",
        "description": "We are looking for a Senior Full Stack Developer to join our engineering team. You will work on building scalable web applications using React, Node.js, and Python. Experience with AWS, Docker, and CI/CD pipelines is required. You'll lead feature development and mentor junior developers.",
        "requirements": "5+ years experience, React, Node.js, Python, AWS, Docker",
        "url": "https://example.com/jobs/demo-001",
        "company_logo": "",
        "date_posted": "2026-03-28T10:00:00Z"
    },
    {
        "job_id": "demo-002",
        "title": "Backend Engineer",
        "company": "DataFlow Inc",
        "location": "New York, NY",
        "salary_min": 130000,
        "salary_max": 165000,
        "work_type": "Hybrid",
        "description": "Join our backend team to build robust APIs and microservices. We use Python (FastAPI), PostgreSQL, Redis, and deploy on AWS. You'll design data models, optimize queries, and ensure high availability of our platform serving millions of users.",
        "requirements": "Python, FastAPI/Django, PostgreSQL, Redis, AWS, 3+ years",
        "url": "https://example.com/jobs/demo-002",
        "company_logo": "",
        "date_posted": "2026-03-29T08:00:00Z"
    },
    {
        "job_id": "demo-003",
        "title": "Frontend React Developer",
        "company": "PixelCraft Studio",
        "location": "Austin, TX",
        "salary_min": 110000,
        "salary_max": 145000,
        "work_type": "Remote",
        "description": "We need a talented React developer to build beautiful, performant user interfaces. You'll work with TypeScript, React, Tailwind CSS, and integrate with REST APIs. Experience with state management (Redux/Zustand) and testing (Jest/Cypress) is a plus.",
        "requirements": "React, TypeScript, Tailwind CSS, REST APIs, 2+ years",
        "url": "https://example.com/jobs/demo-003",
        "company_logo": "",
        "date_posted": "2026-03-30T12:00:00Z"
    },
    {
        "job_id": "demo-004",
        "title": "Cloud Infrastructure Engineer",
        "company": "CloudNine Systems",
        "location": "Seattle, WA",
        "salary_min": 150000,
        "salary_max": 190000,
        "work_type": "Hybrid",
        "description": "Design and maintain cloud infrastructure on AWS. You'll work with Terraform, Kubernetes, Docker, and CI/CD pipelines. Strong Linux skills and experience with monitoring tools (Datadog, Prometheus) required. Python scripting for automation.",
        "requirements": "AWS, Terraform, Kubernetes, Docker, Python, Linux, 4+ years",
        "url": "https://example.com/jobs/demo-004",
        "company_logo": "",
        "date_posted": "2026-03-27T14:00:00Z"
    },
    {
        "job_id": "demo-005",
        "title": "Junior Software Engineer",
        "company": "StartupHub",
        "location": "Remote, US",
        "salary_min": 75000,
        "salary_max": 95000,
        "work_type": "Remote",
        "description": "Entry-level position for a recent graduate or early career developer. You'll work on our web platform using JavaScript, React, and Node.js. We provide mentorship and growth opportunities. Basic knowledge of SQL and Git required.",
        "requirements": "JavaScript, React, Node.js, SQL, Git, 0-2 years",
        "url": "https://example.com/jobs/demo-005",
        "company_logo": "",
        "date_posted": "2026-03-30T09:00:00Z"
    },
    {
        "job_id": "demo-006",
        "title": "Python Data Engineer",
        "company": "AnalyticsEdge",
        "location": "Chicago, IL",
        "salary_min": 125000,
        "salary_max": 160000,
        "work_type": "On-site",
        "description": "Build and maintain data pipelines using Python, Apache Spark, and Airflow. You'll work with large datasets, design ETL processes, and optimize data warehouse queries. Experience with SQL, AWS Glue, and Redshift is preferred.",
        "requirements": "Python, SQL, Apache Spark, Airflow, AWS, 3+ years",
        "url": "https://example.com/jobs/demo-006",
        "company_logo": "",
        "date_posted": "2026-03-26T11:00:00Z"
    },
    {
        "job_id": "demo-007",
        "title": "DevOps Engineer",
        "company": "ReliaTech",
        "location": "Denver, CO",
        "salary_min": 120000,
        "salary_max": 155000,
        "work_type": "Remote",
        "description": "Manage CI/CD pipelines, container orchestration, and cloud infrastructure. We use Docker, Kubernetes, GitHub Actions, and AWS. You'll implement monitoring, alerting, and ensure 99.9% uptime. Python and Bash scripting skills needed.",
        "requirements": "Docker, Kubernetes, AWS, CI/CD, Python, Bash, 3+ years",
        "url": "https://example.com/jobs/demo-007",
        "company_logo": "",
        "date_posted": "2026-03-29T16:00:00Z"
    },
    {
        "job_id": "demo-008",
        "title": "Full Stack JavaScript Developer",
        "company": "WebForge Labs",
        "location": "Portland, OR",
        "salary_min": 115000,
        "salary_max": 145000,
        "work_type": "Hybrid",
        "description": "Build end-to-end features using React, Next.js, and Node.js with Express. We use MongoDB and PostgreSQL for data storage. Experience with TypeScript, GraphQL, and testing frameworks is a plus. Agile team environment.",
        "requirements": "React, Node.js, TypeScript, MongoDB, PostgreSQL, 2+ years",
        "url": "https://example.com/jobs/demo-008",
        "company_logo": "",
        "date_posted": "2026-03-28T13:00:00Z"
    },
    {
        "job_id": "demo-009",
        "title": "Machine Learning Engineer",
        "company": "AI Dynamics",
        "location": "Boston, MA",
        "salary_min": 155000,
        "salary_max": 200000,
        "work_type": "Hybrid",
        "description": "Develop and deploy machine learning models for production. You'll work with Python, TensorFlow/PyTorch, and AWS SageMaker. Strong background in statistics and data science required. Experience with NLP and computer vision is a plus.",
        "requirements": "Python, TensorFlow/PyTorch, AWS, ML/AI, Statistics, 4+ years",
        "url": "https://example.com/jobs/demo-009",
        "company_logo": "",
        "date_posted": "2026-03-25T10:00:00Z"
    },
    {
        "job_id": "demo-010",
        "title": "React Native Mobile Developer",
        "company": "AppCraft Mobile",
        "location": "Miami, FL",
        "salary_min": 110000,
        "salary_max": 140000,
        "work_type": "Remote",
        "description": "Build cross-platform mobile apps using React Native and TypeScript. You'll integrate REST APIs, implement push notifications, and ensure smooth performance on iOS and Android. Experience with app store deployment process required.",
        "requirements": "React Native, TypeScript, REST APIs, iOS/Android, 2+ years",
        "url": "https://example.com/jobs/demo-010",
        "company_logo": "",
        "date_posted": "2026-03-29T09:00:00Z"
    },
    {
        "job_id": "demo-011",
        "title": "Site Reliability Engineer",
        "company": "Uptime Corp",
        "location": "Remote, US",
        "salary_min": 140000,
        "salary_max": 175000,
        "work_type": "Remote",
        "description": "Ensure high availability and performance of distributed systems. You'll work with Kubernetes, Prometheus, Grafana, and AWS. On-call rotation required. Strong Python scripting skills and experience with incident management processes.",
        "requirements": "Kubernetes, AWS, Prometheus, Python, Linux, 4+ years",
        "url": "https://example.com/jobs/demo-011",
        "company_logo": "",
        "date_posted": "2026-03-27T08:00:00Z"
    },
    {
        "job_id": "demo-012",
        "title": "API Platform Developer",
        "company": "ConnectAPI",
        "location": "San Jose, CA",
        "salary_min": 135000,
        "salary_max": 170000,
        "work_type": "Hybrid",
        "description": "Design and build API platforms using Python FastAPI and GraphQL. You'll create developer documentation, implement authentication (OAuth2/JWT), and build SDK libraries. Experience with API gateway tools and rate limiting systems.",
        "requirements": "Python, FastAPI, GraphQL, OAuth2, API design, 3+ years",
        "url": "https://example.com/jobs/demo-012",
        "company_logo": "",
        "date_posted": "2026-03-30T07:00:00Z"
    },
    {
        "job_id": "demo-013",
        "title": "Senior React Engineer",
        "company": "UIWorks",
        "location": "Los Angeles, CA",
        "salary_min": 145000,
        "salary_max": 185000,
        "work_type": "Remote",
        "description": "Lead our frontend engineering efforts building complex SPAs with React and TypeScript. You'll architect component libraries, implement design systems, optimize performance, and mentor the team. Experience with Next.js, testing, and accessibility.",
        "requirements": "React, TypeScript, Next.js, Design Systems, 5+ years",
        "url": "https://example.com/jobs/demo-013",
        "company_logo": "",
        "date_posted": "2026-03-28T15:00:00Z"
    },
    {
        "job_id": "demo-014",
        "title": "Database Administrator",
        "company": "DataVault",
        "location": "Dallas, TX",
        "salary_min": 105000,
        "salary_max": 135000,
        "work_type": "On-site",
        "description": "Manage and optimize PostgreSQL and MongoDB databases. You'll handle replication, backup strategies, performance tuning, and migration projects. Experience with AWS RDS, database security, and query optimization is essential.",
        "requirements": "PostgreSQL, MongoDB, AWS RDS, SQL, Performance Tuning, 3+ years",
        "url": "https://example.com/jobs/demo-014",
        "company_logo": "",
        "date_posted": "2026-03-26T09:00:00Z"
    },
    {
        "job_id": "demo-015",
        "title": "Software Engineer II",
        "company": "MegaTech Corp",
        "location": "Redmond, WA",
        "salary_min": 130000,
        "salary_max": 165000,
        "work_type": "Hybrid",
        "description": "Mid-level software engineer role working on our cloud platform. You'll build microservices in Python and Go, work with Docker and Kubernetes, and contribute to our API layer. Strong problem-solving skills and CS fundamentals required.",
        "requirements": "Python, Go, Docker, Kubernetes, REST APIs, CS degree, 3-5 years",
        "url": "https://example.com/jobs/demo-015",
        "company_logo": "",
        "date_posted": "2026-03-29T11:00:00Z"
    },
]


def mock_match_score(resume_skills: list, job: dict) -> dict:
    """Generate a realistic match score based on skill overlap."""
    resume_skills_lower = [s.lower() for s in (resume_skills or [])]
    desc = (job.get("description", "") + " " + job.get("requirements", "")).lower()

    matched = sum(1 for s in resume_skills_lower if s in desc)
    total = max(len(resume_skills_lower), 1)
    base_score = int((matched / total) * 100)
    # Add some randomness
    score = min(100, max(10, base_score + random.randint(-10, 15)))

    # Determine missing skills from requirements
    req_skills = []
    common_skills = ["python", "javascript", "react", "node.js", "aws", "docker",
                     "kubernetes", "typescript", "sql", "postgresql", "mongodb",
                     "go", "terraform", "graphql", "fastapi", "next.js",
                     "tensorflow", "pytorch", "spark", "airflow", "redis"]
    for skill in common_skills:
        if skill in desc and skill not in " ".join(resume_skills_lower):
            req_skills.append(skill.title())
    missing = req_skills[:3]

    reasons = {
        range(80, 101): "Strong match — your skills closely align with the job requirements.",
        range(60, 80): "Good match — you meet most of the core requirements.",
        range(40, 60): "Moderate match — some skills overlap but gaps exist.",
        range(0, 40): "Low match — this role requires significantly different skills.",
    }
    reason = "Could not determine match."
    for r, msg in reasons.items():
        if score in r:
            reason = msg
            break

    return {
        "match_score": score,
        "match_reason": reason,
        "missing_skills": missing,
    }


def mock_tailored_resume(resume_data: dict, job_title: str, job_description: str) -> dict:
    """Generate a mock tailored resume based on existing resume data."""
    skills = resume_data.get("skills", [])
    name = resume_data.get("name", "Alex Johnson")
    email = resume_data.get("email", "alex@email.com")

    # Extract keywords from job description to prioritize
    desc_lower = job_description.lower()
    prioritized_skills = sorted(
        skills,
        key=lambda s: (1 if s.lower() in desc_lower else 0),
        reverse=True,
    )

    return {
        "name": name,
        "contact": {
            "email": email,
            "phone": "(555) 123-4567",
            "linkedin": "linkedin.com/in/" + name.lower().replace(" ", "-"),
        },
        "summary": f"Results-driven software professional with {resume_data.get('experience_years', 5)} years of experience, "
                   f"seeking to leverage expertise in {', '.join(prioritized_skills[:3])} "
                   f"as a {job_title}. Proven track record of delivering scalable solutions "
                   f"and collaborating with cross-functional teams to drive product innovation.",
        "skills": prioritized_skills,
        "experience": [
            {
                "title": resume_data.get("job_titles", ["Software Engineer"])[0],
                "company": "Previous Company Inc.",
                "dates": "2022 - Present",
                "bullets": [
                    f"Developed and maintained web applications using {', '.join(prioritized_skills[:3])}, serving 50K+ daily users",
                    f"Designed RESTful APIs and microservices architecture, improving system performance by 40%",
                    f"Collaborated with product and design teams to deliver features on schedule across 3 major releases",
                    f"Implemented CI/CD pipelines and automated testing, reducing deployment time by 60%",
                ],
            },
            {
                "title": resume_data.get("job_titles", ["Developer", "Junior Developer"])[-1] if len(resume_data.get("job_titles", [])) > 1 else "Junior Developer",
                "company": "Earlier Corp",
                "dates": "2019 - 2022",
                "bullets": [
                    f"Built frontend components using {prioritized_skills[0] if prioritized_skills else 'React'} and modern JavaScript",
                    "Wrote unit and integration tests, achieving 85% code coverage",
                    "Participated in code reviews and agile ceremonies as part of a 6-person team",
                ],
            },
        ],
        "education": resume_data.get("education", [
            {"degree": "B.S. Computer Science", "school": "State University", "year": "2019"}
        ]),
    }
