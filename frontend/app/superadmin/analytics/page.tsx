'use client';

import React from 'react';
import { BarChart3, TrendingUp, PieChart, Download, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', count: 400 },
  { name: 'Tue', count: 300 },
  { name: 'Wed', count: 600 },
  { name: 'Thu', count: 800 },
  { name: 'Fri', count: 500 },
  { name: 'Sat', count: 200 },
  { name: 'Sun', count: 100 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-8 animate-modal-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <BarChart3 className="w-8 h-8 text-indigo-600" /> Governance Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Deep drilldown into resolution efficiency and volume trends.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 transition-transform active:scale-95">
           <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm h-[400px]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Resolution Volume (Weekly)</h3>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                 <TrendingUp className="w-4 h-4" /> +12.4%
              </div>
           </div>
           <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
           </ResponsiveContainer>
        </div>

        <div className="bg-indigo-600 rounded-[40px] p-8 text-white flex flex-col justify-between shadow-2xl shadow-indigo-600/20">
           <div>
              <Calendar className="w-10 h-10 mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">Q4 Performance</h3>
              <p className="text-indigo-100 text-sm">System efficiency has improved by 22% compared to last quarter after AI integration.</p>
           </div>
           <div className="pt-8 border-t border-white/10 mt-8">
              <p className="text-3xl font-black">94.2%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Target Compliance</p>
           </div>
        </div>
      </div>
    </div>
  );
}
