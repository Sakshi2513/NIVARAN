'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-red-500/20 dark:bg-red-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-orange-500/20 dark:bg-orange-600/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-10 shadow-2xl text-center"
      >
        <div className="w-24 h-24 bg-gradient-to-tr from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/30 rotate-12 hover:rotate-0 transition-transform duration-300">
          <ShieldAlert className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          System Interruption
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          We encountered an unexpected internal server error while processing your request. Our engineers have been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center px-6 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return Home
          </button>
        </div>

        {error.digest && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-mono text-slate-500 dark:text-slate-500">
              Error ID: {error.digest}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}