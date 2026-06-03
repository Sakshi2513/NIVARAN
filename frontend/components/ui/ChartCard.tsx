'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from './Card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, action, className = '' }: ChartCardProps) {
  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <div className="flex-1 min-h-[300px] w-full mt-4">
        {children}
      </div>
    </Card>
  );
}
