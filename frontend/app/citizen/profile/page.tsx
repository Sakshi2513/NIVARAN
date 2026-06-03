'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  ShieldCheck, Award, Settings, Bell,
  LogOut, ChevronRight, Heart, Zap,
  History, Star, Trophy
} from 'lucide-react';

export default function CitizenProfile() {
  const [activeTab, setActiveTab] = useState<'account' | 'civic'>('account');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-modal-in">
      {/* Profile Header - Persistent */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -mr-20 -mt-20" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[48px] flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-2xl shadow-indigo-500/30">
            JS
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
               <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">John Sahayak</h1>
               <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Verified Citizen</span>
               </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Citizen ID: NIV-CZ-882193</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
               <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 text-indigo-500" /> Sector 7, District North
               </div>
               <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-indigo-500" /> john.s@example.com
               </div>
            </div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 px-8 py-6 rounded-[32px] text-center border border-indigo-100 dark:border-indigo-800/50 min-w-[160px]">
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Impact Score</p>
             <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">842</p>
             <div className="flex items-center gap-2 mt-2 text-emerald-600 font-black text-[10px] justify-center uppercase tracking-widest">
                <Award className="w-3.5 h-3.5" /> Gold Tier
             </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[28px] w-full border border-slate-200 dark:border-slate-800">
         <button 
           onClick={() => setActiveTab('account')}
           className={`flex-1 px-8 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
             activeTab === 'account' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
           }`}
         >
            <User className="w-4 h-4" /> Identity & Security
         </button>
         <button 
           onClick={() => setActiveTab('civic')}
           className={`flex-1 px-8 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
             activeTab === 'civic' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'
           }`}
         >
            <Trophy className="w-4 h-4" /> Civic Achievements
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'account' ? (
          <motion.div 
            key="account"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { icon: User, label: 'Personal Profile', sub: 'Name, Date of Birth, and Biometrics' },
                { icon: Bell, label: 'Alert Center', sub: 'Push, SMS, and WhatsApp grievance updates' },
                { icon: ShieldCheck, label: 'Security Protocols', sub: 'Two-factor auth and active sessions' },
                { icon: Settings, label: 'App Preferences', sub: 'Theme, language, and ward defaults' },
              ].map((item) => (
                <div key={item.label} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.label}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>

            <button className="w-full py-5 rounded-[28px] bg-red-50 dark:bg-red-900/10 border-2 border-dashed border-red-100 dark:border-red-900/20 text-red-500 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
              <LogOut className="w-5 h-5" /> Terminate Session
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="civic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Achievement Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
               {[
                 { label: 'Grievances Resolved', value: '142', icon: Zap, color: 'blue' },
                 { label: 'Contribution Streak', value: '12 Days', icon: Activity, color: 'emerald' },
                 { label: 'Impact Rank', value: '#12', icon: Star, color: 'amber' },
               ].map((stat) => (
                 <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center text-${stat.color}-600 mb-3`}>
                       <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{stat.label}</p>
                 </div>
               ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
               {[
                 { icon: History, label: 'Grievance History', sub: 'View all your reported and tracked issues' },
                 { icon: Heart, label: 'Community Gratitude', sub: 'Resolution proofs and thank-you notes' },
                 { icon: Award, label: 'Reward Inventory', sub: 'Tax rebates and utility vouchers' },
               ].map((item) => (
                 <div key={item.label} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
                       <item.icon className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.label}</p>
                       <p className="text-[11px] text-slate-500 font-medium">{item.sub}</p>
                     </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
