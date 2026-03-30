import { ExternalLink, FileEdit, MapPin, DollarSign, Sparkles } from 'lucide-react';

const workTypeBadge = {
  remote: 'bg-green-100 text-green-700',
  hybrid: 'bg-blue-100 text-blue-700',
  'on-site': 'bg-gray-100 text-gray-700',
  onsite: 'bg-gray-100 text-gray-700',
};

function getScoreColor(score) {
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#eab308';
  return '#ef4444';
}

function CircularScore({ score }) {
  const color = getScoreColor(score);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-13 h-13 shrink-0">
      <svg className="w-13 h-13 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export default function JobCard({ job, onGenerateResume, isNew }) {
  const score = job.match_score ?? job.matchScore ?? 0;
  const workType = (job.work_type || job.workType || '').toLowerCase();
  const missingSkills = job.missing_skills || job.missingSkills || [];
  const matchReason = job.match_reason || job.matchReason || '';
  const salary = job.salary || job.salary_range || '';
  const companyInitial = (job.company || '?')[0].toUpperCase();
  const location = job.location || '';
  const jobUrl = job.url || job.apply_url || job.link || '#';

  const badgeClass =
    workTypeBadge[workType] ||
    workTypeBadge[workType.replace(/[\s-]/g, '')] ||
    'bg-gray-100 text-gray-700';

  const workTypeLabel =
    workType.charAt(0).toUpperCase() + workType.slice(1) || 'Unknown';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
      {/* NEW badge */}
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
          NEW
        </span>
      )}

      {/* Top row: company icon, title, score */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{
            backgroundColor: `hsl(${(companyInitial.charCodeAt(0) * 47) % 360}, 65%, 55%)`,
          }}
        >
          {companyInitial}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 leading-snug truncate">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">{job.company}</p>
        </div>
        <CircularScore score={score} />
      </div>

      {/* Location & salary */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </span>
        )}
        {salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            {salary}
          </span>
        )}
      </div>

      {/* Work type badge */}
      {workType && (
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${badgeClass}`}
          >
            {workTypeLabel}
          </span>
        </div>
      )}

      {/* Match reason */}
      {matchReason && (
        <div className="flex items-start gap-1.5 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-2">
            {matchReason}
          </p>
        </div>
      )}

      {/* Missing skills */}
      {missingSkills.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1">
            {missingSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs border border-red-300 text-red-600 rounded-full bg-red-50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <a
          href={jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Apply Now
        </a>
        <button
          onClick={() => onGenerateResume(job)}
          className="flex-1 flex items-center justify-center gap-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-sm font-medium py-2 rounded-lg transition-colors cursor-pointer"
        >
          <FileEdit className="w-3.5 h-3.5" />
          Generate Resume
        </button>
      </div>
    </div>
  );
}
