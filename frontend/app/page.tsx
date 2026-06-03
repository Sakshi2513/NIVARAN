'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Map, Activity, User, Briefcase, FileText, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 blur-[120px]" />
      </div>

      <header className="fixed top-0 w-full z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">
              Nivaran
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="hidden sm:inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-slate-900 shadow-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all">
              Register
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-800/50">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Smart City Governance Platform
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            AI-Powered <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Civic Intelligence
            </span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto">
            Transforming grievance redressal through Artificial Intelligence, transparency, geo-intelligence, and active citizen engagement.
          </motion.p>
        </motion.div>

        <motion.div 
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Choose Your Portal</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Citizen Portal Card */}
            <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Citizen</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1">
                  File smart complaints, track resolution timelines, and engage with community issues using AI assistance.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><FileText className="w-4 h-4 mr-2 text-blue-500" /> Smart Form Filing</div>
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Map className="w-4 h-4 mr-2 text-blue-500" /> Issue Heatmaps</div>
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Activity className="w-4 h-4 mr-2 text-blue-500" /> Real-time Tracking</div>
                </div>
                <Link href="/auth/login" className="mt-auto w-full inline-flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group/btn">
                  Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Officer Portal Card */}
            <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Government Officer</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1">
                  Manage assigned grievances, monitor emergency alerts, and streamline field operations with geo-intelligence.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Shield className="w-4 h-4 mr-2 text-indigo-500" /> SLA Monitoring</div>
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Map className="w-4 h-4 mr-2 text-indigo-500" /> Field Operations</div>
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Activity className="w-4 h-4 mr-2 text-indigo-500" /> Task Management</div>
                </div>
                <Link href="/auth/login" className="mt-auto w-full inline-flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 text-sm font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors group/btn">
                  Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* SuperAdmin Portal Card */}
            <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">SuperAdmin</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1">
                  National governance dashboard for predictive analytics, department rankings, and NLP AI monitoring.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Activity className="w-4 h-4 mr-2 text-purple-500" /> Predictive Governance</div>
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><Briefcase className="w-4 h-4 mr-2 text-purple-500" /> Department Ranking</div>
                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300"><User className="w-4 h-4 mr-2 text-purple-500" /> Audit Logging</div>
                </div>
                <Link href="/auth/login" className="mt-auto w-full inline-flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20 px-4 py-3 text-sm font-semibold text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors group/btn">
                  Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
