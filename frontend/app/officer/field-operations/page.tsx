'use client';

import React from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { OfficerMap } from '../../../components/maps/OfficerMap';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Activity, ShieldAlert, Navigation } from 'lucide-react';

export default function FieldOperationsPage() {
  const mockMarkers = [
    {
      id: '1',
      lat: 28.6139,
      lng: 77.2090,
      title: 'Water Main Burst',
      description: 'Critical flooding on street.',
      statusColor: 'red'
    },
    {
      id: '2',
      lat: 28.6200,
      lng: 77.2150,
      title: 'Pothole Assessment',
      description: 'Scheduled for review today.',
      statusColor: 'yellow'
    },
    {
      id: '3',
      lat: 28.6050,
      lng: 77.2000,
      title: 'Streetlight Repair',
      description: 'Assigned to Team B.',
      statusColor: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Field Operations & Geo-Intelligence" 
        description="Monitor active assignments, issue clusters, and direct field teams."
        action={
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center">
            <Navigation className="w-4 h-4 mr-2" />
            Optimize Route
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Live Incident Map</CardTitle>
            </CardHeader>
            <div className="flex-1 p-6 pt-0">
              <OfficerMap markers={mockMarkers} height="100%" />
            </div>
          </Card>
        </div>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <ShieldAlert className="w-5 h-5 mr-2" />
                Critical Hotspots
              </CardTitle>
            </CardHeader>
            <div className="p-6 pt-0 space-y-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-400">Sector 4, Dwarka</h4>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">High concentration of water logging complaints.</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-400">Main Market Road</h4>
                <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">Multiple pothole reports affecting traffic.</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Active Patrol Teams
              </CardTitle>
            </CardHeader>
            <div className="p-6 pt-0 space-y-4">
              {['Team Alpha (Water)', 'Team Bravo (Roads)', 'Team Charlie (Sanitation)'].map((team, i) => (
                <div key={team} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{team}</span>
                  </div>
                  <span className="text-xs text-slate-500">{i + 2} Tasks</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
