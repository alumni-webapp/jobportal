import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import ProfileCard from './components/ProfileCard';
import FilterPanel from './components/FilterPanel';
import JobGrid from './components/JobGrid';
import ResumeModal from './components/ResumeModal';
import useFilters from './hooks/useFilters';
import { fetchJobs, matchJobs } from './api';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [resumeFilename, setResumeFilename] = useState('');
  const [jobs, setJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJobForResume, setSelectedJobForResume] = useState(null);

  const { filteredJobs, filters, setFilters, clearFilters } =
    useFilters(matchedJobs);

  const loadJobs = useCallback(
    async (resume) => {
      const data = resume || resumeData;
      if (!data) return;

      setLoadingJobs(true);
      try {
        const skills = data.skills || [];
        const preferredRoles = data.preferred_roles || data.preferredRoles || [];
        const jobsResult = await fetchJobs(skills, preferredRoles);
        const jobsList = jobsResult.jobs || jobsResult || [];
        setJobs(jobsList);

        if (jobsList.length > 0) {
          const matchResult = await matchJobs(data, jobsList);
          const matched = matchResult.matched_jobs || matchResult || [];
          setMatchedJobs(matched);
          toast.success(`Found ${matched.length} matched jobs!`);
        } else {
          setMatchedJobs([]);
          toast('No jobs found. Try updating your resume.', { icon: '🔍' });
        }
      } catch (err) {
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Failed to fetch jobs.';
        toast.error(msg);
      } finally {
        setLoadingJobs(false);
      }
    },
    [resumeData]
  );

  const handleResumeParsed = useCallback(
    (data, filename) => {
      // API returns {session_id, filename, parsed_data} — use parsed_data
      const parsed = data.parsed_data || data;
      setResumeData(parsed);
      setResumeFilename(filename || data.filename || '');
      loadJobs(parsed);
    },
    [loadJobs]
  );

  const handleChangeResume = useCallback(() => {
    setResumeData(null);
    setResumeFilename('');
    setJobs([]);
    setMatchedJobs([]);
  }, []);

  const handleGenerateResume = useCallback((job) => {
    setSelectedJobForResume(job);
  }, []);

  // If no resume uploaded, show upload screen
  if (!resumeData) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <ResumeUpload onResumeParsed={handleResumeParsed} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gray-50">
        <Header
          resumeFilename={resumeFilename}
          onChangeResume={handleChangeResume}
          onRefreshJobs={() => loadJobs()}
          loadingJobs={loadingJobs}
        />

        <div className="flex">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
          />

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            {/* Profile card */}
            <div className="mb-6">
              <ProfileCard resumeData={resumeData} />
            </div>

            {/* Job grid */}
            <JobGrid
              jobs={filteredJobs}
              loading={loadingJobs}
              onGenerateResume={handleGenerateResume}
            />
          </main>
        </div>
      </div>

      {/* Resume modal */}
      {selectedJobForResume && (
        <ResumeModal
          resumeData={resumeData}
          job={selectedJobForResume}
          onClose={() => setSelectedJobForResume(null)}
        />
      )}
    </>
  );
}

export default App;
