'use client';

/**
 * LeafletMap.tsx — Production-Grade Vanilla Leaflet Engine
 * 
 * WHY THIS APPROACH:
 * react-leaflet's <MapContainer> initializes the map via a React ref callback.
 * React 18 Strict Mode re-attaches refs BEFORE useEffect cleanup runs, causing
 * "Map container is already initialized" because the container still has a
 * _leaflet_id from the previous mount.
 *
 * By using the vanilla Leaflet API (L.map) inside useEffect, we get React's
 * guarantee that cleanup runs BEFORE the next effect — making initialization
 * and destruction perfectly ordered, even under Strict Mode double-mount.
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Icon Setup ──────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createIcon = (color: string) =>
  new L.DivIcon({
    className: 'nivaran-marker',
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 8px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const ICONS: Record<string, L.DivIcon> = {
  CRITICAL: createIcon('#ef4444'),
  HIGH: createIcon('#f59e0b'),
  MEDIUM: createIcon('#64748b'),
  DEFAULT: createIcon('#3b82f6'),
};

// ─── Types ───────────────────────────────────────────────────
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  level?: string;
}

export interface LeafletMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
}

// ─── Component ───────────────────────────────────────────────
const LeafletMap: React.FC<LeafletMapProps> = ({
  markers = [],
  center = [28.6139, 77.209],
  zoom = 12,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // ── Effect 1: Initialize & destroy the map ─────────────────
  // React 18 Strict Mode sequence:
  //   mount1 → effect1 runs (creates map)
  //   unmount → cleanup1 runs (map.remove() — scrubs _leaflet_id)
  //   mount2 → effect1 runs again (creates fresh map on clean container)
  // This ordering is GUARANTEED by useEffect, unlike ref callbacks.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const map = L.map(node, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    // Leaflet needs a frame to measure the container
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      // Full teardown — remove all listeners, destroy instance, scrub DOM
      markersLayerRef.current = null;
      mapRef.current = null;
      map.off();
      map.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // center/zoom are handled in Effect 3 — this effect only runs once.

  // ── Effect 2: Sync markers reactively ──────────────────────
  useEffect(() => {
    const layer = markersLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    markers.forEach((m) => {
      const icon = ICONS[m.level || 'DEFAULT'] || ICONS.DEFAULT;
      const marker = L.marker([m.lat, m.lng], { icon });

      marker.bindPopup(
        `<div style="font-family:system-ui,sans-serif;">
          <p style="font-weight:700;font-size:13px;margin:0 0 4px;">${m.title}</p>
          ${
            m.level
              ? `<span style="font-size:10px;padding:2px 8px;border-radius:4px;font-weight:700;text-transform:uppercase;background:${
                  m.level === 'CRITICAL'
                    ? '#fef2f2;color:#dc2626'
                    : m.level === 'HIGH'
                    ? '#fffbeb;color:#d97706'
                    : '#f1f5f9;color:#475569'
                }">${m.level}</span>`
              : ''
          }
        </div>`
      );

      layer.addLayer(marker);
    });
  }, [markers]);

  // ── Effect 3: Sync center/zoom without remounting ──────────
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', zIndex: 0 }}
    />
  );
};

LeafletMap.displayName = 'LeafletMap';
export default LeafletMap;
