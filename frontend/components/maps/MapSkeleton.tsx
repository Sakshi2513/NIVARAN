import React from 'react';

export const MapSkeleton = () => (
  <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-slate-800/50 rounded-xl">
    <div className="relative">
      <div className="w-10 h-10 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
      <div className="absolute inset-0 w-10 h-10 border-4 border-transparent border-b-emerald-500/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
    <span className="text-slate-400 font-medium text-xs mt-4 tracking-wider uppercase">
      Initializing Geo-System
    </span>
  </div>
);
