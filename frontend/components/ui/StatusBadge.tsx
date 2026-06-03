import React from 'react';
import { STATUS_COLORS, SEVERITY_COLORS } from '../../lib/constants';
import { ComplaintStatus, ComplaintSeverity } from '../../types';

interface StatusBadgeProps {
  status?: ComplaintStatus;
  severity?: ComplaintSeverity;
  className?: string;
}

export function StatusBadge({ status, severity, className = '' }: StatusBadgeProps) {
  if (status) {
    const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}>
        {status.replace('_', ' ')}
      </span>
    );
  }

  if (severity) {
    const colorClass = SEVERITY_COLORS[severity] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
        {severity}
      </span>
    );
  }

  return null;
}
