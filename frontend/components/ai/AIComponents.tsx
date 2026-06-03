'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, AlertCircle, Info, Zap, Shield,
  Brain, Frown, Meh, Smile, Siren,
  Copy, ChevronRight, Layers, Lightbulb, FileText
} from 'lucide-react';
import type { AISeverity, AISentiment, AISummary, AIDuplicateResult, AIPriority } from '../../services/aiGovernanceEngine';

// ─── Severity Badge ──────────────────────────────────────────
const SEVERITY_CONFIG = {
  LOW: { color: 'slate', icon: Info, label: 'Low' },
  MEDIUM: { color: 'blue', icon: AlertCircle, label: 'Medium' },
  HIGH: { color: 'amber', icon: AlertTriangle, label: 'High' },
  CRITICAL: { color: 'red', icon: Zap, label: 'Critical' },
};

export function AISeverityBadge({ severity, showBar = false }: { severity: AISeverity; showBar?: boolean }) {
  const cfg = SEVERITY_CONFIG[severity.level];
  const Icon = cfg.icon;

  return (
    <div className="inline-flex flex-col gap-1.5">
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-${cfg.color}-500/15 text-${cfg.color}-500 border border-${cfg.color}-500/25`}>
        <Icon className="w-3 h-3" />
        {cfg.label} ({severity.score})
      </span>
      {showBar && (
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${severity.score}%` }}
            transition={{ duration: 1 }}
            className={`h-full bg-${cfg.color}-500 rounded-full`}
          />
        </div>
      )}
    </div>
  );
}

// ─── Priority Indicator ──────────────────────────────────────
const PRIORITY_CONFIG = {
  LOW: { color: 'slate', icon: Info, label: 'Low Priority' },
  MEDIUM: { color: 'blue', icon: Shield, label: 'Medium Priority' },
  HIGH: { color: 'amber', icon: AlertTriangle, label: 'High Priority' },
  EMERGENCY: { color: 'red', icon: Siren, label: 'Emergency' },
};

export function PriorityIndicator({ priority }: { priority: AIPriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  const Icon = cfg.icon;
  const isEmergency = priority === 'EMERGENCY';

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-${cfg.color}-500/15 text-${cfg.color}-500 border border-${cfg.color}-500/25 ${isEmergency ? 'animate-pulse' : ''}`}>
      <Icon className={`w-3 h-3 ${isEmergency ? 'animate-bounce' : ''}`} />
      {cfg.label}
    </span>
  );
}

// ─── Sentiment Indicator ─────────────────────────────────────
const SENTIMENT_CONFIG = {
  calm: { color: 'emerald', icon: Smile, label: 'Calm' },
  frustrated: { color: 'amber', icon: Meh, label: 'Frustrated' },
  angry: { color: 'red', icon: Frown, label: 'Angry' },
  panic: { color: 'red', icon: Siren, label: 'Panic' },
};

export function SentimentIndicator({ sentiment }: { sentiment: AISentiment }) {
  const cfg = SENTIMENT_CONFIG[sentiment.sentiment];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-${cfg.color}-500/15 text-${cfg.color}-500 border border-${cfg.color}-500/25`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
      <span className="text-[10px] text-slate-400 font-mono">{sentiment.confidence}%</span>
    </div>
  );
}

// ─── AI Summary Card ─────────────────────────────────────────
export function AISummaryCard({ summary, compact = false }: { summary: AISummary; compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-indigo-50 dark:bg-indigo-900/15 border border-indigo-200 dark:border-indigo-800/40 rounded-xl p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Brain className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Summary</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300">{summary.shortSummary}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/15 border border-indigo-200 dark:border-indigo-800/40 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Intelligence Report</span>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5 flex items-center gap-1"><FileText className="w-3 h-3" /> Summary</p>
          <p className="text-sm text-slate-800 dark:text-slate-200">{summary.shortSummary}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5 flex items-center gap-1"><Shield className="w-3 h-3" /> Officer Brief</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{summary.officerBrief}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-0.5 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Recommendation</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 italic">{summary.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Duplicate Warning ───────────────────────────────────────
export function DuplicateWarning({ duplicates }: { duplicates: AIDuplicateResult }) {
  if (!duplicates.isDuplicate) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 dark:bg-amber-900/15 border border-amber-300 dark:border-amber-700/50 rounded-xl p-3 flex items-start gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-800/30 flex items-center justify-center shrink-0">
        <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
          Possible Duplicate Detected ({duplicates.confidence}% match)
        </p>
        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
          {duplicates.linkedComplaintIds.length} similar complaint{duplicates.linkedComplaintIds.length > 1 ? 's' : ''} found in the same area.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Full AI Analysis Card (for complaint submission result) ─
export function AIAnalysisCard({ analysis }: { analysis: {
  category: { category: string; department: string; confidence: number };
  severity: AISeverity;
  sentiment: AISentiment;
  summary: AISummary;
  priority: AIPriority;
  duplicates: AIDuplicateResult;
}}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Brain className="w-5 h-5 text-indigo-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Analysis Complete</h3>
      </div>

      {/* Category + Department */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Category</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{analysis.category.category}</p>
          <p className="text-[10px] text-indigo-500 font-mono mt-0.5">{analysis.category.confidence}% confidence</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
          <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Routed To</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{analysis.category.department}</p>
        </div>
      </div>

      {/* Severity + Priority + Sentiment */}
      <div className="flex flex-wrap gap-2">
        <AISeverityBadge severity={analysis.severity} />
        <PriorityIndicator priority={analysis.priority} />
        <SentimentIndicator sentiment={analysis.sentiment} />
      </div>

      {/* Severity Bar */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
          <span>Severity Score</span>
          <span className="font-mono font-bold">{analysis.severity.score}/100</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.severity.score}%` }}
            transition={{ duration: 1.2 }}
            className={`h-full rounded-full ${
              analysis.severity.score >= 81 ? 'bg-red-500' :
              analysis.severity.score >= 61 ? 'bg-amber-500' :
              analysis.severity.score >= 31 ? 'bg-blue-500' : 'bg-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Duplicate Warning */}
      <DuplicateWarning duplicates={analysis.duplicates} />

      {/* AI Summary */}
      <AISummaryCard summary={analysis.summary} compact />
    </motion.div>
  );
}
