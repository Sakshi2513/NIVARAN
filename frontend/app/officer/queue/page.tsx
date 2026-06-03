'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, Search, Clock, AlertTriangle, 
  ChevronRight, Timer, MapPin, CheckCircle2,
  ListTodo, ArrowUpRight, ShieldAlert, Zap
} from 'lucide-react';
import { PriorityIndicator } from '../../../components/ai/AIComponents';

export default function OfficerQueue() {
  const queue = [
    { id: '8924', title: 'Massive Sinkhole - MG Road', priority: 'EMERGENCY', sla: '14m', category: 'Infrastructure', status: 'Assigned', time: '10:32 AM' },
    { id: '8812', title: 'Sewer Overflow - Sector 4', priority: 'HIGH', sla: '2h', category: 'Sanitation', status: 'In Progress', time: '09:15 AM' },
    { id: '8790', title: 'Streetlight Cluster Outage', priority: 'MEDIUM', sla: '8h', category: 'Electricity', status: 'Pending', time: 'Yesterday' },
    { id: '8654', title: 'Broken Divider - Highway 8', priority: 'LOW', sla: '2d', category: 'Infrastructure', status: 'Pending', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6 animate-modal-in max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
             <ListTodo className="w-6 h-6 text-indigo-500" /> Operational Work Queue
          </h1>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">District North-4 • Sector 7 Execution Node</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter by ID or Location..." 
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-indigo-500 w-64 transition-all"
            />
          </div>
          <button className="bg-slate-900 p-2 rounded-xl text-slate-400 hover:text-white transition-colors border border-slate-800">
             <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* SLA Risk Banner */}
      <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
               <Timer className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
               <p className="text-xs font-bold text-white uppercase tracking-widest">Average Resolution Speed</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">District average: 3.2 days • Your node: 2.8 days</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-xl font-black text-indigo-400 font-mono">14.2h</p>
            <p className="text-[9px] text-indigo-500/70 font-bold uppercase">SLA MARGIN</p>
         </div>
      </div>

      {/* Queue List */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-[32px] overflow-hidden">
         <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <div className="col-span-5">Task / Operational ID</div>
            <div className="col-span-2 text-center">Priority</div>
            <div className="col-span-2 text-center">SLA Limit</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1"></div>
         </div>

         <div className="divide-y divide-slate-800/50">
            {queue.map((task) => (
              <motion.div 
                key={task.id}
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.3)' }}
                className="grid grid-cols-12 gap-4 px-6 py-5 items-center cursor-pointer group"
              >
                <div className="col-span-5">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-indigo-400 font-mono">#OP-{task.id}</span>
                    <span className="text-[10px] text-slate-600 uppercase font-bold">• {task.category}</span>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                   <PriorityIndicator priority={task.priority as any} />
                </div>
                <div className="col-span-2 flex flex-col items-center">
                   <div className={`flex items-center gap-1 text-xs font-black font-mono ${task.priority === 'EMERGENCY' ? 'text-red-400' : 'text-slate-400'}`}>
                      <Clock className="w-3 h-3" /> {task.sla}
                   </div>
                   <p className="text-[8px] text-slate-600 uppercase font-bold tracking-tighter mt-0.5">Remaining</p>
                </div>
                <div className="col-span-2 flex justify-center">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                     task.status === 'Assigned' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                     task.status === 'In Progress' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                     'border-slate-700 text-slate-500 bg-slate-800/20'
                   }`}>
                     {task.status}
                   </span>
                </div>
                <div className="col-span-1 flex justify-end">
                   <div className="p-1.5 rounded-lg bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                   </div>
                </div>
              </motion.div>
            ))}
         </div>
      </div>

      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-red-500" />
               <span className="text-[9px] font-bold text-slate-500 uppercase">Emergency Override active</span>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-indigo-500" />
               <span className="text-[9px] font-bold text-slate-500 uppercase">Load: 84% Capacity</span>
            </div>
         </div>
         <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
            Batch Assign Tasks
         </button>
      </div>
    </div>
  );
}
