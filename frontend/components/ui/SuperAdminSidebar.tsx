'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut, Hexagon, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

export function SuperAdminSidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col h-full bg-black border-r border-indigo-900/30 text-indigo-100/70 shadow-[2px_0_30px_rgba(79,70,229,0.05)]">
      <div className="p-6 flex flex-col items-center border-b border-indigo-900/40 relative overflow-hidden">
        {/* Glowing Background Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-600/20 rounded-full blur-[40px] pointer-events-none" />
        
        <div className="w-12 h-12 relative flex items-center justify-center mb-3">
          <Hexagon className="w-12 h-12 text-indigo-500 absolute animate-[spin_10s_linear_infinite]" strokeWidth={1} />
          <Hexagon className="w-8 h-8 text-indigo-400 absolute" strokeWidth={2} />
          <Terminal className="w-4 h-4 text-white relative z-10" />
        </div>
        
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-widest uppercase text-center leading-none">
          NIVARAN<br/>
          <span className="text-[10px] text-indigo-300/50 tracking-[0.2em] font-mono mt-1 block">Command Center</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 pb-3 pt-2 text-[9px] font-bold text-indigo-500/50 uppercase tracking-[0.2em] font-mono">
          System Modules
        </div>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 group relative text-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-transparent text-indigo-200 font-semibold'
                    : 'hover:bg-indigo-900/20 hover:text-indigo-300'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sa-sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-4 h-4 mr-3 transition-all duration-300 ${
                    isActive ? 'text-indigo-400 scale-110 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'group-hover:text-indigo-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="tracking-wide font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-indigo-900/40 bg-gradient-to-t from-indigo-950/20 to-transparent relative">
        <div className="flex items-center p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 mb-3 backdrop-blur-md">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-indigo-100 truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-indigo-400/70 truncate uppercase tracking-wider font-mono">
              Clearance Level 9
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-white bg-indigo-600/20 rounded-xl hover:bg-indigo-600/40 border border-indigo-500/30 hover:border-indigo-500/60 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.1)] hover:shadow-[0_0_20px_rgba(79,70,229,0.2)]"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
