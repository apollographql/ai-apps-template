export function SkeletonTile() {
  return (
    <div className="border border-primary rounded-lg p-4 shadow-sm animate-pulse">
      <div className="w-full h-32 bg-gray-300 rounded mb-2"></div>
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
      <div className="h-5 bg-gray-300 rounded w-16"></div>
    </div>
  );
}
