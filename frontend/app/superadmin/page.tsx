'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Map as MapIcon, 
  Activity, Shield, AlertTriangle, 
  TrendingUp, Globe, BrainCircuit,
  Building2, Server, Layers
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { AdminMap } from '../../components/maps/AdminMap';
import { GovernanceDataService, GovernanceState } from '../../services/governanceDataService';

const DEFAULT_PERFORMANCE = [
  { name: 'Water', efficiency: 94, volume: 450 },
  { name: 'Power', efficiency: 78, volume: 320 },
  { name: 'Roads', efficiency: 62, volume: 890 },
  { name: 'Health', efficiency: 88, volume: 150 },
];

export default function AdminDashboard() {
  const [govState, setGovState] = React.useState<GovernanceState | null>(null);

  React.useEffect(() => {
    GovernanceDataService.getIntelligenceState().then(setGovState);
  }, []);

  const performanceData = DEFAULT_PERFORMANCE; // Could also be derived from govState if needed

    <div className="space-y-8 pb-12 animate-modal-in">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
             City Governance <span className="text-blue-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Centralized monitoring of civic performance and AI-driven insights.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">System Optimal</span>
           </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Grievances', value: '1,284', change: '+12%', icon: Activity, color: 'blue' },
          { label: 'AI Accuracy', value: '94.2%', change: '+0.5%', icon: BrainCircuit, color: 'indigo' },
          { label: 'System Readiness', value: `${govState?.preparednessScore || 85}%`, change: '+2%', icon: TrendingUp, color: 'emerald' },
          { label: 'Governance Alerts', value: String(govState?.alerts.length || 0), change: 'NEW', icon: Shield, color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
               <div className={`p-2 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
               </div>
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'}`}>
                  {stat.change}
               </span>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* City-Wide Map Analytics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-2 shadow-sm relative overflow-hidden">
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur absolute top-2 left-2 right-2 z-10 rounded-t-[28px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Globe className="w-4 h-4 text-blue-500" /> City Strategic Heatmap
                </h3>
             </div>
             <div className="h-[500px] rounded-[28px] overflow-hidden">
                <AdminMap />
             </div>
          </div>
        </div>

        {/* Strategic Data Matrix */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Department Performance */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" /> Department Ranking
             </h3>
             <div className="space-y-6">
                {performanceData.map(dept => (
                  <div key={dept.name}>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">{dept.name}</span>
                       <span className="text-xs font-black text-blue-600">{dept.efficiency}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${dept.efficiency > 80 ? 'bg-emerald-500' : dept.efficiency > 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${dept.efficiency}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* AI Intelligence Insights */}
          <div className="bg-blue-600 rounded-[32px] p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
             <h3 className="text-xs font-bold text-blue-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" /> AI Gov Intelligence
             </h3>
             <div className="space-y-3">
                {govState?.alerts.slice(0, 2).map((alert, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] font-bold uppercase mb-1">{alert.type} Alert</p>
                    <p className="text-xs text-blue-50 leading-relaxed">{alert.message}</p>
                  </div>
                )) || (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <p className="text-[10px] font-bold uppercase mb-1">Infrastructure Alert</p>
                      <p className="text-xs text-blue-50 leading-relaxed">Potential sewer failure predicted in Ward 12 with 84% confidence.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <p className="text-[10px] font-bold uppercase mb-1">Resource Optimization</p>
                      <p className="text-xs text-blue-50 leading-relaxed">Cluster analysis recommends shifting 2 mobile response units to Sector 4.</p>
                    </div>
                  </>
                )}
             </div>
          </div>

        </div>
      </div>

      {/* Ward Status Grid */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ward Performance Matrix</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">Full Analytics Report</button>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[12, 7, 3, 5, 1, 9, 4, 11].map(ward => (
              <div key={ward} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center hover:border-blue-500 transition-all cursor-pointer">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Ward {ward}</p>
                 <p className="text-xl font-black text-slate-900 dark:text-white">92%</p>
                 <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '92%' }} />
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
