import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export function StatCard({ title, value, icon: Icon, trend, colorClass = 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl transition-colors duration-300 ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-slate-500 dark:text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </Card>
  );
}
