'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Bell, Sun, Moon, Search, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-40 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="lg:hidden mr-4 p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-blue-500 transition-colors">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 w-64 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
