'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Clock, MapPin, 
  ChevronRight, ChevronDown, AlertCircle, CheckCircle2,
  Calendar, ArrowUpRight, User, ShieldCheck,
  MessageSquare, Upload, Phone, Info,
  BarChart3, TrendingUp, PieChart as PieChartIcon,
  Zap, Globe
} from 'lucide-react';
import Link from 'next/link';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, Tooltip 
} from 'recharts';
import dynamic from 'next/dynamic';
import { LiveComplaintFeed, ComplaintRecord } from '../../../services/liveComplaintFeed';

const TrackMap = dynamic(() => import('../../../components/maps/TrackIssueMap'), { ssr: false });
const TrackTrendGraph = dynamic(() => import('../../../components/graphs/TrackTrendGraph'), { ssr: false });

const COLORS = ['#e2e8f0', '#fbbf24', '#3b82f6', '#10b981', '#ef4444'];

export default function TrackIssues() {
  const [issues, setIssues] = React.useState<ComplaintRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [highlightedIssueId, setHighlightedIssueId] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Initial subscription
    const unsubscribe = LiveComplaintFeed.subscribe(setIssues);
    
    // Simulate Live Refresh Mode every 10 seconds
    const interval = setInterval(() => {
      // In a real app, this might be a socket event or a polling fetch
      // Here, the store's simulation already updates, but we force a component refresh if needed
      // or just trust the store subscription.
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleBarClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleMarkerClick = (marker: any) => {
    setHighlightedIssueId(marker.id);
    // Scroll to issue
    const el = document.getElementById(`issue-${marker.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getIssueColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'red';
      case 'HIGH': return 'blue';
      case 'MEDIUM': return 'amber';
      default: return 'emerald';
    }
  };

  // Analytics Data
  const statsData = [
    { name: 'Pending', value: issues.filter(i => i.status === 'Received').length },
    { name: 'Assigned', value: issues.filter(i => i.status === 'Assigned').length },
    { name: 'In Progress', value: issues.filter(i => i.status === 'In Progress').length },
    { name: 'Resolved', value: issues.filter(i => i.status === 'Resolved').length },
  ].filter(s => s.value > 0);

  const severityData = [
    { name: 'Sanitation', count: issues.filter(i => i.category === 'Sanitation').length },
    { name: 'Water Supply', count: issues.filter(i => i.category === 'Water Supply').length },
    { name: 'Roads', count: issues.filter(i => i.category === 'Roads').length },
    { name: 'Electricity', count: issues.filter(i => i.category === 'Electricity').length },
  ];

  const mapMarkers = issues.map(i => ({
    id: i.id,
    lat: i.location.coordinates?.[0],
    lng: i.location.coordinates?.[1],
    title: i.title,
    level: i.severity,
    status: i.status,
    category: i.category
  }));

  const filteredIssues = selectedCategory 
    ? issues.filter(i => i.category === selectedCategory)
    : issues;

  return (
    <div className="space-y-8 pb-20 animate-modal-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Live Civic Simulation Mode Active</span>
           </div>
           <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Live Civic <span className="text-blue-600">Operations Feed</span></h1>
           <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Real-time transparency into grievance resolution and officer activity.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search active tickets..." 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 w-72 transition-all shadow-sm"
            />
          </div>
          <button className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-colors shadow-sm">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
         <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Dist Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PieChartIcon className="w-3 h-3" /> Status Flow
               </h3>
               <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statsData.length > 0 ? statsData : [{ name: 'Empty', value: 1 }]}
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {statsData.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-1.5">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{s.name} ({s.value})</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Distribution Trends
               </h3>
               <div className="h-40">
                  <TrackTrendGraph data={severityData} />
               </div>
               <p className="text-[9px] text-slate-400 mt-4 text-center italic font-medium">Real-time load balancing across civic sectors</p>
            </div>

            {/* Resolution Ratio */}
            <div className="bg-blue-600 rounded-[32px] p-6 text-white shadow-xl shadow-blue-600/20 flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
               <div>
                  <h3 className="text-[10px] font-bold text-blue-100 uppercase tracking-widest flex items-center gap-2">
                     <TrendingUp className="w-4 h-4" /> System Efficiency
                  </h3>
                  <p className="text-4xl font-black mt-4">94.2%</p>
                  <p className="text-xs text-blue-100 mt-1 opacity-80">Avg. Resolution Success</p>
               </div>
               <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/10 mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Avg Resolution</p>
                  <p className="text-sm font-bold">2.8 Days</p>
               </div>
            </div>
         </div>

         {/* Right Side: Signals */}
         <div className="lg:col-span-4 bg-slate-900 rounded-[32px] p-6 border border-slate-800 text-white flex flex-col">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Live System Signals</h3>
            <div className="space-y-4 flex-1">
               {[
                 { msg: 'AI categorization active for all wards', type: 'system' },
                 { msg: 'Deployment of 14 repair units in Sector 7', type: 'unit' },
                 { msg: 'Monsoon risk alerts broadcasted', type: 'alert' },
               ].map((log, i) => (
                 <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                    <p className="text-xs text-slate-400 leading-tight">{log.msg}</p>
                 </div>
               ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-4">
               <div className="flex -space-x-2">
                  {[1,2,3].map(j => <div key={j} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800" />)}
               </div>
               <span className="text-[10px] font-bold text-slate-500">124 Officers Online</span>
            </div>
         </div>
      </div>

      {/* Main Stream Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Active Civic Stream <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
           </h2>
           <div className="flex items-center gap-4">
               {selectedCategory && (
                 <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-[10px] font-black text-blue-600 uppercase border border-blue-200 dark:border-blue-900 px-3 py-1 rounded-lg"
                 >
                   Clear Filter: {selectedCategory}
                 </button>
               )}
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredIssues.length} Operational Events</span>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredIssues.map((issue) => {
              const color = getIssueColor(issue.severity);
              const showOfficer = issue.status === 'Assigned' || issue.status === 'In Progress';
              
              return (
                <motion.div 
                  key={issue.id}
                  id={`issue-${issue.id}`}
                  layout
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    borderColor: highlightedIssueId === issue.id ? '#3b82f6' : 'transparent',
                    boxShadow: highlightedIssueId === issue.id ? '0 20px 40px -12px rgba(59, 130, 246, 0.25)' : 'none'
                  }}
                  exit={{ x: 20, opacity: 0 }}
                  className={`bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border-2 transition-all group cursor-pointer ${
                    highlightedIssueId === issue.id ? 'border-blue-500 scale-[1.01]' : 'border-slate-200 dark:border-slate-800'
                  }`}
                  onClick={() => {
                    setHighlightedIssueId(issue.id);
                    setExpandedId(expandedId === issue.id ? null : issue.id);
                  }}
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center text-${color}-600`}>
                             {issue.status === 'Resolved' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 px-2 py-0.5 rounded uppercase">#CMP-{issue.id}</span>
                               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                 issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 
                                 issue.status === 'In Progress' ? 'bg-amber-100 text-amber-600' :
                                 'bg-blue-100 text-blue-600'
                               }`}>
                                 {issue.status}
                               </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{issue.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <Link href={`/citizen/complaint/${issue.id}`}>
                              <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                 <ArrowUpRight className="w-5 h-5" />
                              </button>
                           </Link>
                           <motion.div 
                             animate={{ rotate: expandedId === issue.id ? 180 : 0 }}
                             className="p-3 text-slate-400"
                           >
                              <ChevronDown className="w-5 h-5" />
                           </motion.div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-xs font-medium text-slate-500">
                         <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" /> Ward {issue.location.ward}
                         </div>
                         <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" /> {new Date(issue.timestamp).toLocaleDateString()}
                         </div>
                         <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-500" /> ETA: {issue.eta}
                         </div>
                      </div>
                    </div>

                    {showOfficer && issue.assignedOfficer && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:w-96 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 relative group/officer"
                      >
                         <div className="absolute -top-3 left-6">
                            <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] shadow-xl">
                               Assigned Officer
                            </div>
                         </div>
                         <div className="flex items-center gap-4 mb-6 pt-2">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                               {issue.assignedOfficer.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  {issue.assignedOfficer.name} <ShieldCheck className="w-4 h-4 text-blue-500" />
                               </p>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{issue.assignedOfficer.designation}</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                               <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Status</p>
                               <div className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> {issue.assignedOfficer.currentActivity}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                               <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Live Progress</p>
                               <p className="text-[11px] font-bold text-slate-900 dark:text-white">{issue.assignedOfficer.liveProgress}%</p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Expanded Intelligence Section */}
                  <AnimatePresence>
                    {expandedId === issue.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-8">
                           {/* Left: Predictive Risk */}
                           <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-4">
                                 <Zap className="w-4 h-4 text-amber-500" />
                                 <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Future Impact Simulator</h4>
                              </div>
                              {issue.aiAnalysis?.futureImpact ? (
                                <div className="space-y-4">
                                   <p className="text-[10px] text-slate-500 font-bold italic leading-relaxed">
                                      "Cost of inaction analysis for Ward {issue.location.ward}:"
                                   </p>
                                   <div className="grid grid-cols-2 gap-4">
                                      {issue.aiAnalysis.futureImpact.simulations.slice(0, 2).map((sim: any, idx: number) => (
                                         <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                            <div className="flex justify-between items-center mb-2">
                                               <span className="text-[8px] font-black text-slate-400 uppercase">{sim.delayHours}h Horizon</span>
                                               <span className="text-[8px] font-black text-red-500 uppercase">{sim.impactLevel}</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight">{sim.predictedOutcome}</p>
                                            <div className="mt-2 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                               <div className="h-full bg-red-500" style={{ width: `${sim.riskScore}%` }} />
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                              ) : (
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-[10px] font-bold text-slate-400 uppercase text-center italic">
                                   Simulation models calibrating...
                                </div>
                              )}
                           </div>

                           {/* Right: Operational Progress */}
                           <div>
                              <div className="flex items-center gap-2 mb-6">
                                 <Clock className="w-4 h-4 text-blue-500" />
                                 <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Resolution Journey</h4>
                              </div>
                              <div className="space-y-6 relative">
                                 <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />
                                 {[
                                   { label: 'Issue Logged', date: 'Today, 10:24 AM', completed: true },
                                   { label: 'AI Triage Complete', date: 'Today, 10:25 AM', completed: true },
                                   { label: 'Officer Assigned', date: 'Awaiting', completed: issue.status !== 'Received' }
                                 ].map((step, i) => (
                                   <div key={i} className="flex gap-4 relative z-10">
                                      <div className={`w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`} />
                                      <div>
                                         <p className={`text-[10px] font-black uppercase tracking-tight ${step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{step.label}</p>
                                         <p className="text-[9px] text-slate-500">{step.date}</p>
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {issues.length === 0 && (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">No active operations in your area</h3>
               <p className="text-slate-500 mt-2">All systems are optimal. Use the button below to report a new issue.</p>
               <Link href="/citizen/file-complaint">
                  <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                     Report Civic Issue
                  </button>
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
