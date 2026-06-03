'use client';

import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

interface TrackTrendGraphProps {
  data: any[];
}

export default function TrackTrendGraph({ data }: TrackTrendGraphProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl" />
    );
  }

  // Generate some "jitter" for the line to make it look like a live trend
  const trendData = data.map((d, i) => ({
    ...d,
    trend: d.count + Math.floor(Math.random() * 3) // Mock trend variation
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 shadow-2xl text-[10px] font-bold">
          <p className="uppercase tracking-widest text-slate-400 mb-1">{payload[0].payload.name}</p>
          <p className="text-sm text-blue-400">{payload[0].value} Active Issues</p>
          <p className="text-[8px] text-slate-500 mt-1 uppercase">Live Monitoring Active</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={trendData} 
          margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTrend)" 
            animationDuration={1500}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#60a5fa" 
            strokeWidth={2} 
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
