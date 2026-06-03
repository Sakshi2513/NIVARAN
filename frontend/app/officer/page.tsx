'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Clock, MapPin, 
  ChevronRight, Activity, ShieldAlert,
  BarChart3, Users, CheckCircle2, Search
} from 'lucide-react';
import { OfficerMap } from '../../components/maps/OfficerMap';
import { AISeverityBadge, PriorityIndicator } from '../../components/ai/AIComponents';

export default function OfficerDashboard() {
  const [activeTask, setActiveTask] = useState<any>(null);
  
  const workQueue = [
    { id: '8924', title: 'Sinkhole on Main Avenue', priority: 'EMERGENCY', sla: 14, category: 'Infrastructure', lat: 28.6139, lng: 77.2090, reported: '10:32 AM' },
    { id: '8812', title: 'Sewer Overflow Sector 4', priority: 'HIGH', sla: 120, category: 'Sanitation', lat: 28.6200, lng: 77.2100, reported: '09:15 AM' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-modal-in">
      {/* Officer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Grievance <span className="text-indigo-600">Operations</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Management of assigned civic tasks and SLA monitoring.</p>
        </div>
        
        <div className="flex gap-3">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <div className="text-right">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Tasks</p>
                 <p className="text-lg font-black text-slate-900 dark:text-white">14</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                 <Activity className="w-6 h-6 text-indigo-600" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Work Queue */}
        <div className="lg:col-span-5 space-y-4">
           <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Priority Queue</h3>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
           </div>
           
           <div className="space-y-4">
              {workQueue.map(task => (
                <div 
                  key={task.id}
                  onClick={() => setActiveTask(task)}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg ${activeTask?.id === task.id ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 dark:border-slate-800 shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <PriorityIndicator priority={task.priority as any} />
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-500">#{task.id}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-500">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-bold">{task.sla}m</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">{task.title}</h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{task.category}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Sector 4-B
                    </span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Tactical Map / Action Area */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-2 shadow-sm">
              <div className="h-[400px] rounded-[28px] overflow-hidden relative">
                 <OfficerMap 
                   markers={activeTask ? [{ id: activeTask.id, lat: activeTask.lat, lng: activeTask.lng, title: activeTask.title, level: activeTask.priority }] : []}
                   height="100%"
                 />
                 {!activeTask && (
                   <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl text-center">
                         <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-6 h-6 text-indigo-600" />
                         </div>
                         <h4 className="font-bold text-slate-900 dark:text-white">Select a Task</h4>
                         <p className="text-xs text-slate-500 mt-1">Select from the queue to view field details</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           {activeTask && (
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">Active Operation: {activeTask.title}</h3>
                   <p className="text-xs text-slate-500">Awaiting field report and resolution proof</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest text-xs">
                   Open Ops Drawer
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
