import { useState, useMemo } from 'react';

const defaultFilters = {
  keyword: '',
  workType: [],
  experienceLevel: [],
  datePosted: 'any',
  minMatchScore: 0,
};

export default function useFilters(matchedJobs) {
  const [filters, setFilters] = useState(defaultFilters);

  const clearFilters = () => setFilters(defaultFilters);

  const filteredJobs = useMemo(() => {
    if (!matchedJobs || matchedJobs.length === 0) return [];

    return matchedJobs.filter((job) => {
      // Keyword filter
      if (filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase();
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        if (!title.includes(kw) && !company.includes(kw)) return false;
      }

      // Work type filter
      if (filters.workType.length > 0) {
        const jobWorkType = (job.work_type || job.workType || '').toLowerCase();
        const match = filters.workType.some(
          (wt) => jobWorkType.includes(wt.toLowerCase())
        );
        if (!match) return false;
      }

      // Experience level filter
      if (filters.experienceLevel.length > 0) {
        const desc = (
          (job.description || '') +
          ' ' +
          (job.title || '') +
          ' ' +
          (job.experience_level || '')
        ).toLowerCase();

        const matchesLevel = filters.experienceLevel.some((level) => {
          if (level === 'Entry') {
            return (
              desc.includes('entry') ||
              desc.includes('junior') ||
              desc.includes('0-2 year') ||
              desc.includes('intern') ||
              desc.includes('graduate') ||
              desc.includes('fresher')
            );
          }
          if (level === 'Mid') {
            return (
              desc.includes('mid') ||
              desc.includes('3-5 year') ||
              desc.includes('2-5 year') ||
              desc.includes('3+ year') ||
              desc.includes('intermediate')
            );
          }
          if (level === 'Senior') {
            return (
              desc.includes('senior') ||
              desc.includes('lead') ||
              desc.includes('principal') ||
              desc.includes('staff') ||
              desc.includes('6+ year') ||
              desc.includes('5+ year') ||
              desc.includes('manager')
            );
          }
          return false;
        });
        if (!matchesLevel) return false;
      }

      // Date posted filter
      if (filters.datePosted !== 'any' && job.date_posted) {
        const posted = new Date(job.date_posted);
        const now = new Date();
        const diffMs = now - posted;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (filters.datePosted === '24h' && diffDays > 1) return false;
        if (filters.datePosted === '7d' && diffDays > 7) return false;
        if (filters.datePosted === '30d' && diffDays > 30) return false;
      }

      // Match score filter
      const score = job.match_score ?? job.matchScore ?? 0;
      if (score < filters.minMatchScore) return false;

      return true;
    });
  }, [matchedJobs, filters]);

  return { filteredJobs, filters, setFilters, clearFilters };
}
