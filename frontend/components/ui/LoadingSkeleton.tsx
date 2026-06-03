import React from 'react';

interface LoadingSkeletonProps {
  type: 'card' | 'table' | 'profile' | 'chart';
  count?: number;
}

export function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const elements = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <>
        {elements.map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mt-6"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse overflow-hidden">
        <div className="h-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800"></div>
        {elements.map((i) => (
          <div key={i} className="flex p-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 space-x-4">
            <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
  );
}
