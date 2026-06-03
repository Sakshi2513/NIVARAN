'use client';

import React from 'react';
import { Network, Server, ShieldCheck, Activity, Terminal, Lock } from 'lucide-react';

export default function AdminSystemHealth() {
  return (
    <div className="space-y-8 animate-modal-in">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
           <Network className="w-8 h-8 text-emerald-600" /> System Integrity
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Infrastructure uptime and node health across the national grid.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Server className="w-5 h-5 text-emerald-500" /> Compute Nodes
              </h3>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                 99.99% Uptime
              </div>
           </div>
           <div className="space-y-6">
              {[
                { name: 'Core Engine (Primary)', status: 'Online', load: 14 },
                { name: 'Database Cluster', status: 'Online', load: 32 },
                { name: 'Map Rendering Service', status: 'Online', load: 8 },
                { name: 'NLP Processor', status: 'Online', load: 45 },
              ].map(node => (
                <div key={node.name} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{node.name}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500" style={{ width: `${node.load}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{node.load}%</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[40px] p-8 border border-slate-800 text-white relative overflow-hidden">
              <ShieldCheck className="w-12 h-12 mb-4 text-emerald-500 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Security Perimeter</h3>
              <p className="text-slate-400 text-sm mb-6">Zero-trust architecture active. No unauthorized access attempts detected in last 24h.</p>
              <button className="flex items-center gap-2 text-emerald-400 font-bold text-xs hover:underline">
                 <Terminal className="w-4 h-4" /> Run Audit Log
              </button>
           </div>
           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Lock className="w-4 h-4 text-blue-500" /> Global Override
              </h3>
              <p className="text-xs text-slate-500 mb-4">Manual system-wide emergency lock capability (Requires Level 5 Auth).</p>
              <button className="w-full py-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-900/30">
                 System Lockdown
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
