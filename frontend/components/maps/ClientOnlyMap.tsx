'use client';

/**
 * ClientOnlyMap.tsx — SSR-Safe Dynamic Mounting Boundary
 *
 * Ensures LeafletMap is:
 * 1. Never imported on the server (dynamic + ssr:false)
 * 2. Never rendered until the browser has fully hydrated (mounted state)
 * 3. Shows a skeleton loader during both phases
 */

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapSkeleton } from './MapSkeleton';
import type { LeafletMapProps } from './LeafletMap';

const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export function ClientOnlyMap(props: LeafletMapProps & { height?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          height: props.height || '100%',
          width: '100%',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}
      >
        <MapSkeleton />
      </div>
    );
  }

  return (
    <div
      style={{
        height: props.height || '100%',
        width: '100%',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0,
      }}
    >
      <DynamicLeafletMap
        markers={props.markers}
        center={props.center}
        zoom={props.zoom}
      />
    </div>
  );
}
