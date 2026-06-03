'use client';

import React from 'react';
import { Cpu, BrainCircuit, Activity, Zap, ShieldCheck, Database } from 'lucide-react';

export default function AdminAIPipeline() {
  return (
    <div className="space-y-8 animate-modal-in">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
           <Cpu className="w-8 h-8 text-purple-600" /> AI Pipeline Status
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time health monitoring of NLP models and predictive engines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Model Accuracy', value: '98.2%', icon: BrainCircuit, color: 'purple' },
          { label: 'Latency', value: '12ms', icon: Zap, color: 'amber' },
          { label: 'Data Ingest', value: '4.2 GB/s', icon: Database, color: 'blue' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 dark:bg-${kpi.color}-900/30 flex items-center justify-center mb-4 text-${kpi.color}-600`}>
                <kpi.icon className="w-6 h-6" />
             </div>
             <p className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</p>
             <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-950 rounded-[40px] p-8 border border-slate-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Activity className="w-4 h-4 text-purple-500" /> Neural Pipeline Logs
            </h3>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Processing</span>
            </div>
         </div>
         <div className="space-y-4 font-mono text-[10px]">
            {[
              '[15:14:02] INGEST: Ward 12 Complaint #8924 -> Classification: Infrastructure (94% confidence)',
              '[15:14:05] PREDICT: Cluster 4 -> Risk score elevated to 82/100 (Historical trend match)',
              '[15:14:08] ACTION: Auto-routing #8924 to Dept: Public Works',
              '[15:14:12] SYSTEM: Model sync complete. Weights updated for regional dialect "Hindi-Colloquial".',
            ].map((log, i) => (
              <div key={i} className="text-slate-400 border-l-2 border-purple-500/30 pl-4 py-1 hover:text-white transition-colors">
                 {log}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
