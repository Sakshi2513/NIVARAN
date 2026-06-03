'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  MapPin,
  Bell,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { UserRole, ROLE_DISPLAY_NAMES } from '@/types/roles'

// Navigation items for each role
const NAV_ITEMS: Record<UserRole, { label: string; href: string; icon: any }[]> = {
  [UserRole.CITIZEN]: [
    { label: 'Dashboard', href: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'My Complaints', href: '/citizen/complaints', icon: FileText },
    { label: 'File Complaint', href: '/citizen/file-complaint', icon: MapPin },
  ],
  [UserRole.OFFICER]: [
    { label: 'Dashboard', href: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', href: '/officer/complaints', icon: FileText },
    { label: 'Analytics', href: '/officer/analytics', icon: BarChart3 },
  ],
  [UserRole.DEPARTMENT_HEAD]: [
    { label: 'Dashboard', href: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', href: '/officer/complaints', icon: FileText },
    { label: 'Analytics', href: '/officer/analytics', icon: BarChart3 },
    { label: 'My Department', href: '/officer/department', icon: Users },
  ],
  [UserRole.SUPERADMIN]: [
    { label: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', href: '/superadmin/complaints', icon: FileText },
    { label: 'Users', href: '/superadmin/users', icon: Users },
    { label: 'Analytics', href: '/superadmin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/superadmin/settings', icon: Settings },
  ]
}

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  
  if (!user) return null

  const role = user.role as UserRole
  const navItems = NAV_ITEMS[role] || NAV_ITEMS[UserRole.CITIZEN]

  // Get portal name based on role
  const getPortalName = () => {
    switch (role) {
      case UserRole.CITIZEN:
        return 'Citizen Portal'
      case UserRole.OFFICER:
      case UserRole.DEPARTMENT_HEAD:
        return 'Officer Portal'
      case UserRole.SUPERADMIN:
        return 'Admin Portal'
      default:
        return 'Portal'
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href={`/${role}/dashboard`} className="flex items-center gap-2">
            <div className="w-8 h-8 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
               <img src="/nivaran_logo.png" alt="Nivaran Logo" className="w-full h-full object-cover" />
            </div>
            {isOpen && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">Nivaran</span>
            )}
          </Link>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Portal Name */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {getPortalName()}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {ROLE_DISPLAY_NAMES[role]}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"
              title="Logout"
            >
              <LogOut className="w-5 h-5 mx-auto" />
            </button>
          )}
        </div>
      </aside>
    </>
  )
}

// Mobile header with menu button
export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore()
  
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center px-4">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
      <span className="ml-3 text-lg font-bold text-gray-900 dark:text-white">Nivaran</span>
      <div className="ml-auto flex items-center gap-2">
        {user && (
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}