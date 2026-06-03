'use client';

import React from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { StatCard } from '../../../components/ui/StatCard';
import { BrainCircuit, AlertOctagon, FileCheck, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AiMonitoringPage() {
  const duplicateData = [
    { name: 'Water', duplicates: 45 },
    { name: 'Roads', duplicates: 120 },
    { name: 'Power', duplicates: 15 },
    { name: 'Sanitation', duplicates: 60 }
  ];

  const recentAiLogs = [
    {
      id: 'log-1',
      action: 'Auto-Categorization',
      confidence: 0.98,
      details: 'Complaint #CMP-2024-089 tagged as "Water Supply".',
      timestamp: '2 mins ago'
    },
    {
      id: 'log-2',
      action: 'Duplicate Detection',
      confidence: 0.85,
      details: 'Merged #CMP-090 into parent #CMP-089.',
      timestamp: '15 mins ago'
    },
    {
      id: 'log-3',
      action: 'Severity Escalation',
      confidence: 0.92,
      details: 'Keyword "fire" detected. Escalated to CRITICAL.',
      timestamp: '1 hour ago'
    }
  ];

  const columns = [
    { header: 'Action Type', accessor: 'action' as keyof typeof recentAiLogs[0], className: 'font-medium' },
    { header: 'Details', accessor: 'details' as keyof typeof recentAiLogs[0] },
    { 
      header: 'Confidence Score', 
      accessor: (row: typeof recentAiLogs[0]) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.confidence > 0.9 ? 'bg-green-100 text-green-800' : 
          row.confidence > 0.8 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          {(row.confidence * 100).toFixed(1)}%
        </span>
      )
    },
    { header: 'Time', accessor: 'timestamp' as keyof typeof recentAiLogs[0] }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Monitoring Center" 
        description="Monitor the performance and confidence levels of the NLP engine."
        action={
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center">
            <BrainCircuit className="w-4 h-4 mr-2" />
            Retrain Models
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Overall NLP Confidence" 
          value="94.2%" 
          icon={BrainCircuit} 
          trend={{ value: 1.2, isPositive: true }}
          colorClass="text-purple-600 bg-purple-100 dark:bg-purple-900/30" 
        />
        <StatCard 
          title="Auto-Categorized" 
          value="1,240" 
          icon={FileCheck} 
          colorClass="text-blue-600 bg-blue-100 dark:bg-blue-900/30" 
        />
        <StatCard 
          title="Duplicates Merged" 
          value="342" 
          icon={Layers} 
          trend={{ value: 5, isPositive: false }}
          colorClass="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" 
        />
        <StatCard 
          title="False Positives" 
          value="1.4%" 
          icon={AlertOctagon} 
          colorClass="text-red-600 bg-red-100 dark:bg-red-900/30" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="col-span-1 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent AI Actions Log</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0">
              <DataTable 
                columns={columns} 
                data={recentAiLogs} 
                keyExtractor={(item) => item.id} 
              />
            </div>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Duplicate Detection by Category</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={duplicateData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} width={80} />
                  <Tooltip cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }} />
                  <Bar dataKey="duplicates" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
