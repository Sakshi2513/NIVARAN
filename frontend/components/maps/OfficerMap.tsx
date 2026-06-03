'use client';

import React from 'react';
import { GeoClientOnlyMap } from './GeoClientOnlyMap';

interface OfficerMapProps {
  markers?: any[];
  height?: string;
  officers?: any[];
}

export function OfficerMap({ markers = [], height = '100%', officers }: OfficerMapProps) {
  // Mock officers if none provided
  const mockOfficers = officers || [
    { id: 'o1', name: 'Officer Rajesh', lat: 28.6150, lng: 77.2100, status: 'AVAILABLE' },
    { id: 'o2', name: 'Officer Suman', lat: 28.6200, lng: 77.2150, status: 'EMERGENCY_RESPONSE', assignedRoute: [[28.6200, 77.2150], [28.6250, 77.2200]] },
  ];

  return (
    <GeoClientOnlyMap
      role="officer"
      markers={markers}
      officers={mockOfficers}
      center={[28.6139, 77.209]}
      zoom={13}
      height={height}
    />
  );
}
