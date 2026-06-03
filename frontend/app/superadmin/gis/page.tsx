'use client';

import React from 'react';
import { AdminMap } from '../../../components/maps/AdminMap';
import { Globe, Layers, MapPin, Search } from 'lucide-react';

export default function AdminGIS() {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6 animate-modal-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <Globe className="w-8 h-8 text-blue-600" /> GIS Strategic Matrix
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">National-level spatial intelligence and infrastructure monitoring.</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] overflow-hidden relative shadow-2xl">
         <AdminMap />
         <div className="absolute top-6 left-6 z-10">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
               <div className="relative">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input type="text" placeholder="Locate Ward or ID..." className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-9 pr-4 text-xs outline-none w-64" />
               </div>
               <button className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20"><Layers className="w-4 h-4" /></button>
            </div>
         </div>
      </div>
    </div>
  );
}
