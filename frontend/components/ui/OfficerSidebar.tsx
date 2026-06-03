'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, ShieldAlert, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

export function OfficerSidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="p-5 flex items-center space-x-3 border-b border-slate-800 bg-slate-950">
        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(5,150,105,0.5)] border border-emerald-400/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-wide block leading-tight">
            NIVARAN
          </span>
          <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Active Ops
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 pt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
          Operations
        </div>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 group relative text-sm ${
                  isActive
                    ? 'bg-slate-800 text-white font-medium shadow-inner border border-slate-700/50'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                )}
                <item.icon
                  className={`w-4 h-4 mr-3 transition-colors ${
                    isActive ? 'text-emerald-400' : 'group-hover:text-slate-300'
                  }`}
                />
                <span className="tracking-wide">{item.name}</span>
                
                {/* Simulated Badges */}
                {item.name === 'Emergency Alerts' && (
                  <span className="ml-auto bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                    2
                  </span>
                )}
                {item.name === 'Assigned Complaints' && (
                  <span className="ml-auto bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    14
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center p-2.5 rounded-lg bg-slate-900 border border-slate-800 mb-2">
          <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 font-mono text-sm border border-slate-700">
            {user?.name?.charAt(0) || 'O'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-xs font-bold text-white truncate font-mono">
              OFFICER {user?.name?.split(' ')[0] || '104'}
            </p>
            <p className="text-[10px] text-slate-500 truncate uppercase">
              {user?.role || 'Field Operator'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-xs font-bold font-mono text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-all uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4 mr-2" />
          End Shift
        </button>
      </div>
    </div>
  );
}
