import { Briefcase, RefreshCw, FileText, Upload } from 'lucide-react';

export default function Header({
  resumeFilename,
  onChangeResume,
  onRefreshJobs,
  loadingJobs,
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            JobMatch AI
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {resumeFilename && (
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-gray-700 max-w-[160px] truncate">
                {resumeFilename}
              </span>
              <button
                onClick={onChangeResume}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium ml-1 flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                Change Resume
              </button>
            </div>
          )}

          {resumeFilename && (
            <button
              onClick={onRefreshJobs}
              disabled={loadingJobs}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingJobs ? 'animate-spin' : ''}`}
              />
              Refresh Jobs
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
