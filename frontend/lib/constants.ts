import { UserRole, ComplaintStatus, ComplaintSeverity } from '../types';
import { 
  LayoutDashboard, FileText, Activity, Map, Bell, User, Users, Shield, 
  Settings, Briefcase, AlertTriangle, MessageSquare, Bot, Route, Navigation, 
  BarChart4, Crosshair, Network, FileKey, Zap, PieChart
} from 'lucide-react';

export const COMPLAINT_CATEGORIES = [
  'Infrastructure',
  'Sanitation',
  'Water Supply',
  'Electricity',
  'Public Safety',
  'Transport',
  'Other'
];

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.CITIZEN]: 'Citizen',
  [UserRole.OFFICER]: 'Officer',
  [UserRole.DEPARTMENT_HEAD]: 'Department Head',
  [UserRole.SUPERADMIN]: 'Super Admin'
};

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  [ComplaintStatus.ASSIGNED]: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  [ComplaintStatus.IN_PROGRESS]: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400',
  [ComplaintStatus.RESOLVED]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  [ComplaintStatus.CLOSED]: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
  [ComplaintStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400'
};

export const SEVERITY_COLORS: Record<ComplaintSeverity, string> = {
  [ComplaintSeverity.LOW]: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  [ComplaintSeverity.MEDIUM]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  [ComplaintSeverity.HIGH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  [ComplaintSeverity.CRITICAL]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

// Advanced routing structure for completely decoupled portals
export const SIDEBAR_CONFIG = {
  [UserRole.CITIZEN]: [
    { name: 'Dashboard', href: '/citizen', icon: LayoutDashboard },
    { name: 'File Complaint', href: '/citizen/file-complaint', icon: FileText },
    { name: 'Track Complaints', href: '/citizen/track', icon: Activity },
    { name: 'Nearby Issues', href: '/citizen/nearby', icon: Map },
    { name: 'Community Support', href: '/citizen/community', icon: Users },
    { name: 'Notifications', href: '/citizen/notifications', icon: Bell },
    { name: 'Messages', href: '/citizen/messages', icon: MessageSquare },
    { name: 'AI Assistant', href: '/citizen/ai-assistant', icon: Bot },
    { name: 'Profile', href: '/citizen/profile', icon: User },
  ],
  [UserRole.OFFICER]: [
    { name: 'Operations Dashboard', href: '/officer', icon: Crosshair },
    { name: 'Assigned Complaints', href: '/officer/assigned', icon: Briefcase },
    { name: 'Emergency Alerts', href: '/officer/alerts', icon: AlertTriangle },
    { name: 'Field Operations', href: '/officer/field-operations', icon: Map },
    { name: 'Route Optimization', href: '/officer/routes', icon: Route },
    { name: 'Area Heatmaps', href: '/officer/heatmaps', icon: Navigation },
    { name: 'Citizen Requests', href: '/officer/requests', icon: MessageSquare },
    { name: 'Reports', href: '/officer/reports', icon: FileText },
    { name: 'Analytics', href: '/officer/analytics', icon: BarChart4 },
    { name: 'Team Coordination', href: '/officer/team', icon: Users },
    { name: 'Settings', href: '/officer/settings', icon: Settings },
  ],
  [UserRole.SUPERADMIN]: [
    { name: 'National Dashboard', href: '/superadmin', icon: Network },
    { name: 'Complaint Monitoring', href: '/superadmin/complaints', icon: Activity },
    { name: 'Governance Analytics', href: '/superadmin/analytics', icon: PieChart },
    { name: 'AI Monitoring', href: '/superadmin/ai-monitoring', icon: Bot },
    { name: 'Geo Intelligence', href: '/superadmin/geo', icon: Map },
    { name: 'Emergency Command', href: '/superadmin/emergency', icon: Zap },
    { name: 'Department Management', href: '/superadmin/departments', icon: Briefcase },
    { name: 'Officer Management', href: '/superadmin/officers', icon: Users },
    { name: 'Security Center', href: '/superadmin/security', icon: Shield },
    { name: 'Audit Logs', href: '/superadmin/audit', icon: FileKey },
    { name: 'Predictive Insights', href: '/superadmin/predictive', icon: BarChart4 },
    { name: 'Reports', href: '/superadmin/reports', icon: FileText },
    { name: 'System Settings', href: '/superadmin/settings', icon: Settings },
  ]
};
