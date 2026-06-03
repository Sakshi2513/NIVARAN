'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Clock, User, AlertTriangle, Tag, Building2,
  CheckCircle, ArrowUpRight, MessageSquare, Camera, FileText,
  ChevronRight, Shield, History, Layers, Brain
} from 'lucide-react';
import { AISeverityBadge, AISummaryCard, SentimentIndicator, PriorityIndicator } from './AIComponents';
import { analyzeComplaint } from '../../services/aiGovernanceEngine';

interface ComplaintDrawerProps {
  complaint: any | null;
  onClose: () => void;
  onAction: (action: string, complaintId: string) => void;
}

export function ComplaintDrawer({ complaint, onClose, onAction }: ComplaintDrawerProps) {
  if (!complaint) return null;

  // Generate AI analysis if not already attached to complaint
  const aiAnalysis = React.useMemo(() => {
    if (complaint.aiAnalysis) return complaint.aiAnalysis;
    return analyzeComplaint(complaint.title, complaint.description || '', [], complaint.lat, complaint.lng);
  }, [complaint]);

  const timelineEvents = [
    { action: 'Complaint Filed', time: complaint.reported || '10:32 AM', actor: 'Citizen', done: true },
    { action: 'AI Categorized', time: '10:33 AM', actor: 'NLP Engine', done: true },
    { action: 'Assigned to Officer', time: '10:45 AM', actor: 'System', done: aiAnalysis.priority !== 'LOW' },
    { action: 'Field Inspection', time: 'Pending', actor: '—', done: false },
    { action: 'Resolution', time: 'Pending', actor: '—', done: false },
  ];

  const lc = {
    CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    HIGH: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    MEDIUM: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
    LOW: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
  }[aiAnalysis.severity.level] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <PriorityIndicator priority={aiAnalysis.priority} />
              <span className="text-[10px] text-slate-500 font-mono">#{complaint.id?.substring(0, 8)}</span>
            </div>
            <h2 className="text-lg font-bold text-white truncate">{complaint.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{aiAnalysis.category.category}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Quick Info Grid */}
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Location</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {complaint.lat?.toFixed(4)}, {complaint.lng?.toFixed(4)}
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Reported</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">{complaint.reported}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Brain className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">AI Severity</span>
              </div>
              <AISeverityBadge severity={aiAnalysis.severity} />
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Building2 className="w-3 h-3" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Department</span>
              </div>
              <p className="text-sm text-slate-200 font-medium">
                {aiAnalysis.category.department}
              </p>
            </div>
          </div>

          {/* AI Intelligence Card */}
          <div className="px-4 pb-4">
            <AISummaryCard summary={aiAnalysis.summary} />
          </div>

          {/* Sentiment Analysis */}
          <div className="px-4 pb-4">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Citizen Sentiment</span>
                <SentimentIndicator sentiment={aiAnalysis.sentiment} />
              </div>
              <div className="h-1 w-20 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${aiAnalysis.sentiment.sentiment === 'calm' ? 'bg-emerald-500' : 'bg-red-500'}`} 
                  style={{ width: `${aiAnalysis.sentiment.emotionalIntensity}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Citizen Description */}
          <div className="px-4 pb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Citizen Report
            </h4>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
              <p className="text-sm text-slate-300 leading-relaxed">
                {complaint.title} reported in the area. Multiple citizens have flagged this issue. 
                Requires immediate attention based on severity assessment by the AI classification engine.
              </p>
            </div>
          </div>

          {/* Nearby Similar */}
          <div className="px-4 pb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Similar Nearby (2)
            </h4>
            <div className="space-y-2">
              {[
                { id: 'sim-1', title: `${complaint.category} issue - 400m away`, time: '2h ago' },
                { id: 'sim-2', title: `Related ${complaint.category} report - 1.2km`, time: '6h ago' },
              ].map(sim => (
                <div key={sim.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-700/30 hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <span className="text-xs text-slate-300">{sim.title}</span>
                  <span className="text-[10px] text-slate-500">{sim.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Timeline */}
          <div className="px-4 pb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <History className="w-3 h-3" /> Resolution Timeline
            </h4>
            <div className="space-y-0">
              {timelineEvents.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      event.done 
                        ? 'bg-emerald-500 border-emerald-400' 
                        : 'bg-slate-800 border-slate-600'
                    }`} />
                    {i < timelineEvents.length - 1 && (
                      <div className={`w-0.5 h-8 ${event.done ? 'bg-emerald-500/30' : 'bg-slate-700'}`} />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className={`text-xs font-semibold ${event.done ? 'text-slate-200' : 'text-slate-500'}`}>{event.action}</p>
                    <p className="text-[10px] text-slate-500">{event.time} • {event.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => onAction('accept', complaint.id)}
              className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 py-2.5 text-[11px] rounded-lg hover:bg-emerald-600/40 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Accept
            </button>
            <button 
              onClick={() => onAction('progress', complaint.id)}
              className="bg-blue-600/20 text-blue-400 border border-blue-500/30 py-2.5 text-[11px] rounded-lg hover:bg-blue-600/40 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" /> In Progress
            </button>
            <button 
              onClick={() => onAction('escalate', complaint.id)}
              className="bg-amber-600/20 text-amber-400 border border-amber-500/30 py-2.5 text-[11px] rounded-lg hover:bg-amber-600/40 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5" /> Escalate
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onAction('resolve', complaint.id)}
              className="bg-emerald-600 text-white py-2.5 text-[11px] rounded-lg hover:bg-emerald-500 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
            </button>
            <button 
              onClick={() => onAction('reject', complaint.id)}
              className="bg-slate-800 text-red-400 border border-red-500/20 py-2.5 text-[11px] rounded-lg hover:bg-red-600/20 transition-colors uppercase font-bold tracking-wider flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Reject
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
