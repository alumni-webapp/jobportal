import { Inbox } from 'lucide-react';
import JobCard from './JobCard';
import SkeletonCard from './SkeletonCard';

export default function JobGrid({ jobs, loading, onGenerateResume }) {
  if (loading) {
    return (
      <div>
        <div className="mb-4">
          <div className="h-5 bg-gray-200 rounded w-36 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Inbox className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">
          No jobs match your filters
        </h3>
        <p className="text-sm text-gray-400 max-w-sm">
          Try adjusting your filters or refreshing jobs to discover new
          opportunities.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Showing{' '}
        <span className="font-semibold text-gray-700">{jobs.length}</span>{' '}
        {jobs.length === 1 ? 'job' : 'jobs'}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map((job, index) => (
          <JobCard
            key={job.id || index}
            job={job}
            onGenerateResume={onGenerateResume}
            isNew={job.is_new || job.isNew}
          />
        ))}
      </div>
    </div>
  );
}
