'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ListTodo, Map as MapIcon, 
  LogOut, Bell, Shield, User, Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../../ThemeToggle';

export function OfficerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/officer', active: pathname === '/officer' },
    { icon: ListTodo, label: 'Work Queue', href: '/officer/queue', active: pathname === '/officer/queue' },
    { icon: MapIcon, label: 'Field Map', href: '/officer/map', active: pathname === '/officer/map' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Consistent Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-xl shadow-lg">
               <img src="/nivaran_logo.png" alt="Nivaran Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              Nivaran <span className="text-blue-600 font-medium text-xs ml-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded uppercase">Officer</span>
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-800">
           <div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest hidden sm:block">Officer Command Center</h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs border border-indigo-200 dark:border-indigo-800">
              RK
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
