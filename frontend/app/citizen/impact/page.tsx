'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, TrendingUp, Users, MapPin, 
  Award, Zap, Globe, ShieldCheck,
  CheckCircle2, Sparkles, BarChart3,
  ThumbsUp, MessageSquare, Share2,
  ArrowRight, Info, Building2, Calendar,
  Clock, Activity
} from 'lucide-react';
import { ResolutionDataService, ResolutionEntry } from '../../../services/resolutionDataService';
import dynamic from 'next/dynamic';
import { LiveComplaintFeed } from '../../../services/liveComplaintFeed';
import { CivicPatternRadar, type PatternRadarResults } from '../../../services/civicPatternRadar';

const TrackMap = dynamic(() => import('../../../components/maps/TrackIssueMap'), { ssr: false });

export default function CitizenImpact() {
  const [resolutions, setResolutions] = useState<ResolutionEntry[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'intelligence' | 'action'>('intelligence');

  useEffect(() => {
    const unsubRes = ResolutionDataService.subscribe(setResolutions);
    const unsubIssues = LiveComplaintFeed.subscribe(setIssues);
    return () => {
      unsubRes();
      unsubIssues();
    };
  }, []);

  const impactStats = [
    { label: 'Lives Improved', value: '1,242', icon: Users, trend: '+12%', color: 'blue' },
    { label: 'Infrastructure Fixed', value: '14', icon: Zap, trend: '+4', color: 'amber' },
    { label: 'Community Trust', value: 'Gold', icon: ShieldCheck, trend: 'Peak', color: 'emerald' },
    { label: 'Predictive Resilience', value: '88%', icon: TrendingUp, trend: '+2.4%', color: 'purple' },
  ];

  const mapMarkers = issues.map(i => ({
    id: i.id,
    lat: i.location.coordinates?.[0],
    lng: i.location.coordinates?.[1],
    title: i.title,
    level: i.severity,
    status: i.status
  }));

  const patternResults = CivicPatternRadar.analyzeTemporalPatterns(issues);

  return (
    <div className="space-y-10 pb-20 animate-modal-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">System Level: Autonomous Governance</span>
           </div>
           <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Civic Intelligence <span className="text-indigo-600">Impact</span></h1>
           <p className="text-slate-500 mt-2 text-lg">Quantifying community resilience and structural health.</p>
        </div>
        <div className="bg-indigo-600 px-6 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-600/30">
          <Award className="w-5 h-5" /> Top 1% Contributor
        </div>
      </div>

      {/* Premium Tab Switcher */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[32px] w-full md:w-fit border border-slate-200 dark:border-slate-800 ml-4">
         <button 
           onClick={() => setActiveTab('intelligence')}
           className={`flex-1 md:flex-none px-8 py-4 rounded-[26px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
             activeTab === 'intelligence' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
           }`}
         >
            <Activity className="w-4 h-4" /> Intelligence Hub
         </button>
         <button 
           onClick={() => setActiveTab('action')}
           className={`flex-1 md:flex-none px-8 py-4 rounded-[26px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
             activeTab === 'action' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
           }`}
         >
            <Zap className="w-4 h-4" /> Community Action
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'intelligence' ? (
          <motion.div 
            key="intelligence"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            {/* City Resilience Command Center */}
            <section className="relative group px-4">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[48px] blur-3xl opacity-5 group-hover:opacity-10 transition-opacity" />
               <div className="relative bg-white dark:bg-slate-950 rounded-[48px] p-1 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-[42px] p-8 md:p-12">
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-6">
                           <div className="relative">
                              <svg className="w-64 h-64 transform -rotate-90">
                                 <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                 <motion.circle
                                    cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 110}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                                    animate={{ strokeDashoffset: (2 * Math.PI * 110) * (1 - patternResults.healthIndex / 100) }}
                                    className="text-indigo-600"
                                    strokeLinecap="round"
                                    transition={{ duration: 2, ease: "easeOut" }}
                                 />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                 <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">{patternResults.healthIndex}%</span>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">City Health Index</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 justify-center">
                              <Activity className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Resilience: {patternResults.healthIndex > 80 ? 'Optimal' : 'Strained'}</span>
                           </div>
                        </div>

                        <div className="lg:col-span-7 space-y-8">
                           <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                              <Zap className="w-6 h-6 text-indigo-600" /> AI Policy Pulse
                           </h3>
                           <div className="grid grid-cols-1 gap-4">
                              {patternResults.policyPulse.map((policy, i) => (
                                 <div key={i} className="bg-white dark:bg-slate-950 p-5 rounded-[28px] border border-slate-200 dark:border-slate-800 flex items-center gap-6 group/policy hover:border-indigo-500/50 transition-all">
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                                       <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Recommendation</p>
                                       <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">"{policy}"</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Civic Pattern Radar */}
            <section className="space-y-10 px-4">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-4">
                  <Globe className="w-8 h-8 text-indigo-500" /> Civic Pattern Radar
               </h2>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {patternResults.patterns.map((pattern, idx) => (
                    <div key={idx} className="group relative bg-white dark:bg-slate-950 rounded-[40px] p-10 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
                       <div className="relative z-10">
                          <div className="flex justify-between items-start mb-8">
                             <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                                pattern.patternType === 'WEEKDAY_SPIKE' ? 'bg-rose-500 text-white' :
                                pattern.patternType === 'TIME_OF_DAY' ? 'bg-amber-500 text-white' :
                                'bg-indigo-600 text-white'
                             }`}>
                                {pattern.patternType.replace('_', ' ')}
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round(pattern.confidence * 100)}% Conf.</span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">{pattern.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-10">{pattern.insight}</p>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex gap-1">
                             {pattern.trendData.map((val, i) => (
                               <div key={i} style={{ opacity: val / Math.max(...pattern.trendData), flex: 1 }} className="h-full bg-indigo-600 rounded-full" />
                             ))}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </motion.div>
        ) : (
          <motion.div 
            key="action"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16 px-4"
          >
            {/* Impact Stats Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {impactStats.map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
                  </div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </section>

            {/* Live Operational Map */}
            <section className="space-y-6">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-4">
                  <MapPin className="w-8 h-8 text-indigo-500" /> Resilience Map
               </h2>
               <div className="bg-white dark:bg-slate-900 p-2 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl h-[600px] overflow-hidden">
                  <TrackMap markers={mapMarkers} />
               </div>
            </section>

            {/* Resolution Proof Wall */}
            <section className="space-y-10">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-4">
                  <Award className="w-8 h-8 text-emerald-500" /> Proof Wall
               </h2>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {resolutions.map((proof) => (
                    <div key={proof.id} className="bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl group">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Before Side */}
                        <div className="relative aspect-square md:aspect-auto md:h-[300px] overflow-hidden border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                           <img src={proof.beforeImages[0]} alt="Before" className="w-full h-full object-cover grayscale opacity-80" />
                           <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                              Before
                           </div>
                        </div>
                        {/* After Side */}
                        <div className="relative aspect-square md:aspect-auto md:h-[300px] overflow-hidden">
                           <img src={proof.afterImages[0]} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-xl tracking-widest">
                              After
                           </div>
                        </div>
                      </div>
                      
                      <div className="p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                {proof.title[0]}
                             </div>
                             <div>
                               <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{proof.title}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{proof.departmentResponsible}</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Citizen Verified</span>
                           </div>
                        </div>
                        
                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-[32px] border border-indigo-100/50 dark:border-indigo-800/30">
                           <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Resolution Impact</h4>
                           <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">"{proof.resolutionDescription}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
