'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

export function CitizenSidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            N
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 tracking-tight">
            Nivaran
          </span>
        </Link>
      </div>

      <div className="px-4 py-2">
        <Link href="/citizen/file-complaint">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white py-3 px-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all font-semibold"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Complaint</span>
          </motion.div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="citizen-sidebar-active"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 mr-3 relative z-10 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                <span className="relative z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40 flex items-center justify-center text-blue-600 dark:text-emerald-400 font-bold uppercase border border-white dark:border-slate-700 shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {user?.name || 'Citizen'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.email || 'citizen@nivaran.com'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
