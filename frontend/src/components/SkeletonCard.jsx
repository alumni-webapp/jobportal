export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm animate-pulse">
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 bg-gray-200 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
      </div>

      {/* Location / salary */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-16" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>

      {/* Match reason */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded-lg flex-1" />
        <div className="h-9 bg-gray-200 rounded-lg flex-1" />
      </div>
    </div>
  );
}
