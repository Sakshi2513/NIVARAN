'use client';

import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapSkeleton } from './MapSkeleton';

interface TrackIssueMapProps {
  markers: any[];
  onMarkerClick?: (marker: any) => void;
  center?: [number, number];
  zoom?: number;
}

export default function TrackIssueMap({ markers, onMarkerClick, center = [28.6139, 77.2090], zoom = 12 }: TrackIssueMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = React.useRef<L.Map | null>(null);
  const markersRef = React.useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!mapRef.current) {
      mapRef.current = L.map('track-issue-map', {
        zoomControl: false,
        attributionControl: false
      }).setView(center, zoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
      }).addTo(mapRef.current);

      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }
  }, [isMounted, center, zoom]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !isMounted) return;

    markersRef.current.clearLayers();

    markers.forEach(m => {
      if (typeof m.lat !== 'number' || typeof m.lng !== 'number') return;

      const color = m.level === 'CRITICAL' ? '#ef4444' : m.level === 'HIGH' ? '#3b82f6' : '#10b981';
      const isCritical = m.level === 'CRITICAL';

      const icon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            ${isCritical ? '<div class="absolute w-6 h-6 bg-red-500 rounded-full animate-ping opacity-20"></div>' : ''}
            <div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px ${color}"></div>
          </div>
        `,
        className: 'custom-track-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([m.lat, m.lng], { icon })
        .addTo(markersRef.current!)
        .on('click', () => {
          if (onMarkerClick) onMarkerClick(m);
        });
      
      marker.bindTooltip(m.title, { 
        direction: 'top', 
        offset: [0, -10],
        className: 'custom-tooltip'
      });
    });

    // Auto-fit bounds if markers exist
    if (markers.length > 0) {
      const validMarkers = markers.filter(m => typeof m.lat === 'number' && typeof m.lng === 'number');
      if (validMarkers.length > 0) {
        const bounds = L.latLngBounds(validMarkers.map(m => [m.lat, m.lng]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [markers, isMounted, onMarkerClick]);

  if (!isMounted) return <MapSkeleton />;

  return (
    <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <div id="track-issue-map" className="w-full h-full" />
      
      {/* Mini Controls Overlays */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
            <div className="flex items-center gap-2 px-2 py-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Live Map Active</span>
            </div>
         </div>
      </div>
    </div>
  );
}
