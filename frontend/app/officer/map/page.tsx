'use client';

import React from 'react';
import { OfficerMap } from '../../../components/maps/OfficerMap';
import { Layers, MapPin, Navigation, Info } from 'lucide-react';

export default function OfficerMapPage() {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-4 animate-modal-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Field Intelligence Map</h1>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">District North Operations</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Live Tracking Active</span>
           </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden relative shadow-sm">
        <OfficerMap height="100%" />
        
        {/* Map Overlays */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
           <button className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600">
              <Layers className="w-5 h-5" />
           </button>
           <button className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600">
              <Navigation className="w-5 h-5" />
           </button>
        </div>

        <div className="absolute bottom-6 left-6 z-10 max-w-sm">
           <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2 mb-2 text-indigo-600">
                 <Info className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Geo Insights</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                 You are currently viewing <span className="font-bold">Sector 4</span>. 14 open tickets are clustered near Main Avenue.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
