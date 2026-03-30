import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function fetchJobs(skills, preferredRoles) {
  const response = await api.post('/api/fetch-jobs', {
    skills: skills || [],
    preferred_roles: preferredRoles || [],
  });
  return response.data;
}

export async function matchJobs(resumeData, jobs) {
  const response = await api.post('/api/match-jobs', {
    resume_data: resumeData,
    jobs: jobs,
  });
  return response.data;
}

export async function generateResume(resumeData, jobDescription, jobTitle) {
  const response = await api.post('/api/generate-resume', {
    resume_data: resumeData,
    job_description: jobDescription,
    job_title: jobTitle,
  });
  return response.data;
}
