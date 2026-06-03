'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, BarChart3, Shield, Cpu, 
  Settings, Users, LayoutGrid, Network,
  Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../../ThemeToggle';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems = [
    { icon: LayoutGrid, label: 'Control Panel', href: '/superadmin', active: pathname === '/superadmin' },
    { icon: Globe, label: 'GIS Matrix', href: '/superadmin/gis', active: pathname === '/superadmin/gis' },
    { icon: BarChart3, label: 'Intelligence', href: '/superadmin/analytics', active: pathname === '/superadmin/analytics' },
    { icon: Cpu, label: 'AI Pipeline', href: '/superadmin/ai', active: pathname === '/superadmin/ai' },
    { icon: Network, label: 'System Health', href: '/superadmin/system', active: pathname === '/superadmin/system' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-xl shadow-lg border border-slate-700">
               <img src="/nivaran_logo.png" alt="Nivaran Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Nivaran Admin</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Strategic Command Tower</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Admin Account</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Superuser</p>
               </div>
               <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600" />
               </div>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
