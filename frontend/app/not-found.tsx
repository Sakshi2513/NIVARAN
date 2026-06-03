'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft, Shield } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();
  
  // Determine role from pathname for contextual redirect
  const isCitizen = pathname.startsWith('/citizen');
  const isOfficer = pathname.startsWith('/officer');
  const isAdmin = pathname.startsWith('/superadmin');

  const getHomeLink = () => {
    if (isCitizen) return '/citizen';
    if (isOfficer) return '/officer';
    if (isAdmin) return '/superadmin';
    return '/';
  };

  const getRoleLabel = () => {
    if (isCitizen) return 'Citizen Portal';
    if (isOfficer) return 'Officer Console';
    if (isAdmin) return 'Command Tower';
    return 'Nivaran';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-modal-in">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-blue-800 shadow-xl shadow-blue-500/10">
            <Compass className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="bg-slate-900 dark:bg-white p-1.5 rounded-lg text-white dark:text-slate-900">
               <Shield className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Uncharted Territory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3">
            The page you are looking for doesn't exist in the <span className="font-bold text-blue-600 dark:text-blue-400">{getRoleLabel()}</span>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={getHomeLink()}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
               <Home className="w-5 h-5" /> Return to Dashboard
            </button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-4 rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Go Back
          </button>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase font-black tracking-[0.2em]">
          Error 404 • Protected Routing Active
        </p>
      </div>
    </div>
  );
}