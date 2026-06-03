export enum UserRole {
  CITIZEN = 'citizen',
  OFFICER = 'officer',
  DEPARTMENT_HEAD = 'department_head',
  SUPERADMIN = 'superadmin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headId?: string;
  createdAt: string;
}

export enum ComplaintStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED'
}

export enum ComplaintSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  severity: ComplaintSeverity;
  citizenId: string;
  assignedOfficerId?: string;
  departmentId?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Analytics {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  averageResolutionTime: number; // in hours
}

export interface OfficerAssignment {
  id: string;
  officerId: string;
  complaintId: string;
  assignedAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED';
}