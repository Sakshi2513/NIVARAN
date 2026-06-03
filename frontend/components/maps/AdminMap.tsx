'use client';

import React from 'react';
import { GeoClientOnlyMap } from './GeoClientOnlyMap';

interface AdminMapProps {
  markers?: any[];
  height?: string;
}

export function AdminMap({ markers = [], height = '100%' }: AdminMapProps) {
  return (
    <GeoClientOnlyMap
      role="admin"
      markers={markers}
      center={[28.6139, 77.209]} // City-focused for Governance Matrix
      zoom={12}
      height={height}
    />
  );
}
