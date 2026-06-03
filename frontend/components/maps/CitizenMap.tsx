'use client';

import React, { useEffect, useState } from 'react';
import { GeoClientOnlyMap } from './GeoClientOnlyMap';
import { LiveComplaintFeed } from '../../services/liveComplaintFeed';

interface CitizenMapProps {
  markers?: any[];
  height?: string;
}

export function CitizenMap({ height = '100%' }: CitizenMapProps) {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    return LiveComplaintFeed.subscribe((complaints) => {
      const mapped = complaints.map(c => ({
        id: c.id,
        lat: c.location.coordinates?.[0],
        lng: c.location.coordinates?.[1],
        title: c.title,
        level: c.severity,
        status: c.status
      }));
      setMarkers(mapped);
    });
  }, []);

  return (
    <GeoClientOnlyMap
      role="citizen"
      markers={markers}
      center={[28.6139, 77.209]}
      zoom={14}
      height={height}
    />
  );
}
