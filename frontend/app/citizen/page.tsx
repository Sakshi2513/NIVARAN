'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, MapPin, Bot, Clock, ChevronRight, 
  ThumbsUp, MessageSquare, AlertCircle, ShieldCheck,
  AlertTriangle, Phone, FileText, CheckCircle2, Truck,
  Sparkles, TrendingUp, Users, Heart, Megaphone
} from 'lucide-react';
import Link from 'next/link';
import { CitizenMap } from '../../components/maps/CitizenMap';

export default function CitizenDashboard() {
  const [greeting, setGreeting] = useState('');
  
  const [activeComplaints, setActiveComplaints] = useState([
    { id: '8924', title: 'Pothole on Main Avenue', category: 'Infrastructure', status: 'In Progress', progress: 66, color: 'blue', assignedOfficer: 'Raj K.', lastUpdate: '2h ago' },
    { id: '8810', title: 'Streetlight Outage', category: 'Electricity', status: 'Resolved', progress: 100, color: 'emerald', assignedOfficer: 'Priya S.', lastUpdate: '1d ago' }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const timelineSteps = [
    { label: 'Submitted', icon: FileText },
    { label: 'Reviewed', icon: CheckCircle2 },
    { label: 'Assigned', icon: Truck },
    { label: 'Resolved', icon: ShieldCheck },
  ];

  const getStepIndex = (progress: number) => {
    if (progress >= 100) return 3;
    if (progress >= 66) return 2;
    if (progress >= 33) return 1;
    return 0;
  };

  return (
    <div className="space-y-8 pb-12 animate-modal-in">
      {/* Personalized Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Citizen</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            What civic issue can we help you resolve today?
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/citizen/file-complaint">
            <button className="flex items-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-white/10 font-bold text-lg transition-all hover:scale-105 active:scale-95">
              <PlusCircle className="w-6 h-6" />
              <span>Report an Issue</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Issues', value: '2', icon: AlertCircle, color: 'blue' },
          { label: 'Resolved', value: '12', icon: CheckCircle2, color: 'emerald' },
          { label: 'Avg Resolution', value: '3.2d', icon: Clock, color: 'amber' },
          { label: 'Community Rank', value: '#47', icon: TrendingUp, color: 'purple' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              <span className={`text-2xl font-extrabold text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Assistant Preview Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-3 text-blue-100">
                  <Bot className="w-5 h-5" />
                  <span className="font-semibold tracking-wide text-sm">NIVARAN AI</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">BETA</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Need help navigating an issue?</h2>
                <p className="text-blue-100/80 max-w-md">
                  Our AI assistant can instantly categorize your problem, draft your complaint, and route it to the exact right department.
                </p>
              </div>
              <button className="bg-white text-blue-600 px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors whitespace-nowrap flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Ask Nivaran AI
              </button>
            </div>
          </div>

          {/* Active Issues Tracker */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Complaints</h3>
              <Link href="/citizen/track" className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center hover:underline">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {activeComplaints.map((complaint) => {
                const currentStep = getStepIndex(complaint.progress);
                return (
                  <div 
                    key={complaint.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl bg-${complaint.color}-50 dark:bg-${complaint.color}-900/30 flex items-center justify-center text-${complaint.color}-600 dark:text-${complaint.color}-400`}>
                          {complaint.status === 'Resolved' ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg">{complaint.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">#CMP-{complaint.id} • {complaint.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {complaint.status}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">Updated {complaint.lastUpdate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-2">
                      {timelineSteps.map((step, i) => {
                        const isActive = i <= currentStep;
                        const StepIcon = step.icon;
                        return (
                          <React.Fragment key={step.label}>
                            <div className="flex flex-col items-center gap-1.5">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <StepIcon className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] font-semibold uppercase ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                                {step.label}
                              </span>
                            </div>
                            {i < timelineSteps.length - 1 && (
                              <div className="flex-1 h-0.5 mx-1 mb-5 bg-slate-100 dark:bg-slate-800 relative">
                                <div className={`absolute left-0 top-0 h-full bg-blue-500 transition-all duration-1000`} style={{ width: i < currentStep ? '100%' : '0%' }} />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Content Column */}
        <div className="space-y-6">
          {/* Nearby Issues Map */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center mb-4 uppercase tracking-widest text-xs">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Nearby Awareness
            </h3>
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4 overflow-hidden relative">
              <CitizenMap 
                markers={[
                  { id: '1', lat: 28.6189, lng: 77.2090, title: 'Broken Pipe', level: 'HIGH' },
                  { id: '2', lat: 28.6109, lng: 77.2150, title: 'Pothole', level: 'DEFAULT' }
                ]}
              />
            </div>
            <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-widest">
              Explore GIS Map
            </button>
          </div>

          {/* Civic Awareness */}
          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800/20">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center mb-4 uppercase tracking-widest text-xs">
              <Megaphone className="w-5 h-5 mr-2 text-emerald-600" /> Notifications
            </h3>
            <div className="space-y-3">
              <div className="bg-white/80 dark:bg-slate-800 rounded-xl p-3 shadow-sm">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1 uppercase tracking-tighter">Water Notice</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Scheduled maintenance in Sector 7 on May 3rd.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
