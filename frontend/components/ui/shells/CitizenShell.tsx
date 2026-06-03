'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Search, Bell, User, PlusCircle, 
  ShieldCheck, Heart, Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../../ThemeToggle';

export function CitizenShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/citizen', active: pathname === '/citizen' },
    { icon: Search, label: 'Track Issues', href: '/citizen/track', active: pathname === '/citizen/track' },
    { icon: Heart, label: 'Community', href: '/citizen/impact', active: pathname === '/citizen/impact' },
    { icon: User, label: 'Profile', href: '/citizen/profile', active: pathname === '/citizen/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-xl shadow-lg">
               <img src="/nivaran_logo.png" alt="Nivaran Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Nivaran
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link 
                key={item.label} 
                href={item.href}
                className={`text-sm font-medium transition-colors ${item.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Verified Citizen</span>
            </div>
            <ThemeToggle />
            <button className="md:hidden p-2 text-slate-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-950 pt-16">
          <nav className="p-4 flex flex-col gap-4">
            {navItems.map(item => (
              <Link 
                key={item.label} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-semibold p-3 rounded-xl ${item.active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-500'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
