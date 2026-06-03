'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';

interface TrackIssueGraphProps {
  data: any[];
  onBarClick?: (category: string) => void;
}

export default function TrackIssueGraph({ data, onBarClick }: TrackIssueGraphProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeData = data?.length > 0 ? data : [
    { name: 'Sanitation', count: 0 },
    { name: 'Water', count: 0 },
    { name: 'Roads', count: 0 },
    { name: 'Power', count: 0 },
  ];

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl" />
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-2xl text-[10px] font-bold">
          <p className="uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.name}</p>
          <p className="text-sm">{payload[0].value} Active Issues</p>
          <p className="text-blue-400 mt-1 italic">Click to zoom on map</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={safeData} 
          margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
          onClick={(state) => {
            if (state && state.activeLabel && onBarClick) {
              onBarClick(state.activeLabel);
            }
          }}
        >
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 12 }} />
          <Bar 
            dataKey="count" 
            radius={[10, 10, 10, 10]} 
            barSize={32}
            className="cursor-pointer"
          >
            {safeData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} 
                fillOpacity={0.8}
                className="hover:fill-opacity-100 transition-all duration-300"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
