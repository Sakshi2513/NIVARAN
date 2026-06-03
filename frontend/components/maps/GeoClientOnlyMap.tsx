'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapSkeleton } from './MapSkeleton';
import type { GeoIntelligenceMapProps } from './GeoIntelligenceMap';

const DynamicGeoMap = dynamic(() => import('./GeoIntelligenceMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export function GeoClientOnlyMap(props: GeoIntelligenceMapProps & { height?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: props.height || '100%', width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}>
        <MapSkeleton />
      </div>
    );
  }

  return (
    <div style={{ height: props.height || '100%', width: '100%', borderRadius: '0.75rem', overflow: 'hidden', position: 'relative', zIndex: 0 }}>
      <DynamicGeoMap {...props} />
    </div>
  );
}
