import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const workTypes = ['Remote', 'Hybrid', 'On-site'];
const experienceLevels = ['Entry', 'Mid', 'Senior'];
const dateOptions = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Any time', value: 'any' },
];

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCheckbox = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const panelContent = (
    <div className="space-y-6">
      {/* Keyword search */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Job title or company..."
            value={filters.keyword || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, keyword: e.target.value })
            }
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Work Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Work Type
        </label>
        <div className="space-y-1.5">
          {workTypes.map((wt) => (
            <label
              key={wt}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={(filters.workType || []).includes(wt)}
                onChange={() => handleCheckbox('workType', wt)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {wt}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {experienceLevels.map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={(filters.experienceLevel || []).includes(level)}
                onChange={() => handleCheckbox('experienceLevel', level)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {level}
                <span className="text-gray-400 ml-1 text-xs">
                  {level === 'Entry'
                    ? '(0-2 yrs)'
                    : level === 'Mid'
                      ? '(3-5 yrs)'
                      : '(6+ yrs)'}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Posted */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Date Posted
        </label>
        <div className="space-y-1.5">
          {dateOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="datePosted"
                checked={filters.datePosted === opt.value}
                onChange={() =>
                  onFilterChange({ ...filters, datePosted: opt.value })
                }
                className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Match Score Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Minimum Match Score:{' '}
          <span className="text-indigo-600 font-bold">
            {filters.minMatchScore || 0}%
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={filters.minMatchScore || 0}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              minMatchScore: Number(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Clear button */}
      <button
        onClick={onClearFilters}
        className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors"
        aria-label="Toggle filters"
      >
        {mobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <SlidersHorizontal className="w-5 h-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-[65px] left-0 z-30
          w-[280px] h-full lg:h-[calc(100vh-65px)]
          bg-white border-r border-gray-200
          overflow-y-auto p-5
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
        </div>
        {panelContent}
      </aside>
    </>
  );
}
