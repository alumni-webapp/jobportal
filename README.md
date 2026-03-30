# JobMatch AI - AI-Powered Job Portal

An intelligent job portal that parses your resume using AI, matches you with relevant jobs, and generates tailored resumes for each application.

## Features

- **Resume Upload & AI Parsing** - Upload PDF/DOCX resumes, parsed by Claude AI to extract skills, experience, and preferences
- **AI-Matched Job Listings** - Jobs fetched from real APIs and scored against your resume using Claude AI
- **Smart Filters** - Filter by work type, experience level, date posted, match score, and keywords
- **One-Click Tailored Resume** - Generate ATS-optimized resumes tailored to specific job descriptions
- **Live Job Feed** - Refresh to get the latest job listings with "NEW" badges for fresh posts

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python FastAPI
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Resume Parsing**: pdfplumber (PDF) + python-docx (DOCX)
- **Job Search**: Adzuna API / JSearch API (RapidAPI)
- **Database**: SQLite via SQLAlchemy

## Getting API Keys

### Anthropic Claude API (Required)
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Create an account and add billing
3. Go to API Keys and create a new key

### Adzuna Job Search API (Recommended - Free Tier)
1. Go to [developer.adzuna.com](https://developer.adzuna.com/)
2. Sign up for a free account
3. Create an application to get your App ID and App Key
4. Free tier includes 250 requests/month

### JSearch API via RapidAPI (Alternative)
1. Go to [rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Sign up and subscribe to the free tier
3. Copy your RapidAPI key from the dashboard

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd jobportal
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env and add your API keys
```

### 3. Start the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## Sample .env File

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
ADZUNA_APP_ID=abc12345
ADZUNA_APP_KEY=def67890abcdef
RAPIDAPI_KEY=xxxxx
```

## Project Structure

```
jobportal/
├── backend/
│   ├── main.py              # FastAPI app with all endpoints
│   ├── models.py            # SQLAlchemy database models
│   ├── resume_parser.py     # PDF/DOCX text extraction + Claude parsing
│   ├── job_fetcher.py       # Adzuna/JSearch API integration
│   ├── job_matcher.py       # Claude-powered job matching
│   ├── resume_generator.py  # Tailored resume generation
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── api.js           # API client functions
│   │   ├── hooks/
│   │   │   └── useFilters.js
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── ResumeUpload.jsx
│   │       ├── ProfileCard.jsx
│   │       ├── FilterPanel.jsx
│   │       ├── JobCard.jsx
│   │       ├── JobGrid.jsx
│   │       ├── ResumeModal.jsx
│   │       └── SkeletonCard.jsx
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Usage

1. **Upload Resume**: Drag and drop your PDF or DOCX resume on the homepage
2. **View Profile**: See your parsed skills, experience, and preferences
3. **Browse Jobs**: AI-matched jobs appear sorted by match score
4. **Filter Jobs**: Use the sidebar to narrow down results
5. **Generate Resume**: Click "Generate Resume" on any job card to create a tailored version
6. **Apply**: Click "Apply Now" to go directly to the job application page
