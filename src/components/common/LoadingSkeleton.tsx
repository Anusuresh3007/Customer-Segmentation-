import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-44" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 flex gap-4">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonChart: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between ${height}`}>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-end gap-3 h-full pt-6">
        <Skeleton className="h-2/3 flex-1 rounded-t" />
        <Skeleton className="h-4/5 flex-1 rounded-t" />
        <Skeleton className="h-1/2 flex-1 rounded-t" />
        <Skeleton className="h-3/4 flex-1 rounded-t" />
        <Skeleton className="h-2/5 flex-1 rounded-t" />
      </div>
    </div>
  );
};
