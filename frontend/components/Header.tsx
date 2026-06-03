'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-2xl font-semibold text-cyan-400">
          Nivaran
        </Link>
        <div className="flex flex-1 items-center justify-end gap-3">
          <nav className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
            <Link href="/auth/register" className="hover:text-white">File Complaint</Link>
            <Link href="/complaints" className="hover:text-white">Track Complaint</Link>
            <Link href="/dashboard" className="hover:text-white">Government Login</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
