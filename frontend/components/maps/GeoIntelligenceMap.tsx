'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapControlPanel } from './controls/MapControlPanel';
import { createClusterLayer } from './layers/ClusterLayer';
import { createHeatmapLayer } from './layers/HeatmapLayer';
import { createSeverityZones, createEmergencyPulse } from './layers/ZoneLayer';
import { createOfficerLayer } from './layers/OfficerLayer';
import { createBoundaryLayer } from './layers/BoundaryLayer';
import { WARD_GEOJSON } from './mockGeo';
import { 
  Layers, Map as MapIcon, Shield, Activity, 
  Users, Siren, Zap, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GeoIntelligenceMapProps {
  role: 'citizen' | 'officer' | 'admin';
  markers?: any[];
  officers?: any[];
  center?: [number, number];
  zoom?: number;
}

const GeoIntelligenceMap: React.FC<GeoIntelligenceMapProps> = ({
  role,
  markers = [],
  officers = [],
  center = [28.6139, 77.209],
  zoom = 12,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Layer Refs
  const clusterLayerRef = useRef<L.MarkerClusterGroup | null>(null);
  const heatmapLayerRef = useRef<L.Layer | null>(null);
  const zoneLayerRef = useRef<L.LayerGroup | null>(null);
  const officerLayerRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayerRef = useRef<L.LayerGroup | null>(null);
  const pulseLayerRef = useRef<L.LayerGroup | null>(null);

  // UI State
  const [activeLayers, setActiveLayers] = useState([
    { id: 'clusters', name: 'Clusters', enabled: true, icon: Activity, role: ['citizen', 'officer', 'admin'] },
    { id: 'heatmap', name: 'Heatmap', enabled: true, icon: Zap, role: ['citizen', 'officer', 'admin'] },
    { id: 'zones', name: 'Severity Zones', enabled: role !== 'citizen', icon: Shield, role: ['officer', 'admin'] },
    { id: 'officers', name: 'Field Officers', enabled: role === 'officer', icon: Users, role: ['officer', 'admin'] },
    { id: 'boundaries', name: 'Wards', enabled: role === 'admin', icon: MapIcon, role: ['admin'] },
    { id: 'pulse', name: 'Emergencies', enabled: true, icon: Siren, role: ['citizen', 'officer', 'admin'] },
  ]);

  const filteredLayers = activeLayers.filter(l => l.role.includes(role));

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => prev.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l));
  };

  // ── Initialize Map ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false, // We'll use our own or just standard Leaflet one but moved
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Sync Layers ─────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Cluster Layer
    const clusterConfig = activeLayers.find(l => l.id === 'clusters');
    if (clusterLayerRef.current) map.removeLayer(clusterLayerRef.current);
    if (clusterConfig?.enabled) {
      clusterLayerRef.current = createClusterLayer(markers);
      clusterLayerRef.current.addTo(map);
    }

    // 2. Heatmap Layer
    const heatmapConfig = activeLayers.find(l => l.id === 'heatmap');
    if (heatmapLayerRef.current) map.removeLayer(heatmapLayerRef.current);
    if (heatmapConfig?.enabled) {
      const heatData = markers
        .filter(m => typeof m.lat === 'number' && typeof m.lng === 'number')
        .map(m => {
          let intensity = 0;
          if (m.status !== 'Resolved') {
            intensity = m.level === 'CRITICAL' ? 5.0 : m.level === 'HIGH' ? 4.0 : m.level === 'MEDIUM' ? 3.0 : 1.0;
          }
          return { lat: m.lat, lng: m.lng, intensity };
        });
      heatmapLayerRef.current = createHeatmapLayer(heatData, { max: 5.0 });
      heatmapLayerRef.current.addTo(map);
    }

    // 3. Zone Layer
    const zoneConfig = activeLayers.find(l => l.id === 'zones');
    if (zoneLayerRef.current) map.removeLayer(zoneLayerRef.current);
    if (zoneConfig?.enabled) {
      const mockZones = [
        { level: 'CRITICAL', coordinates: [[28.61, 77.20], [28.62, 77.20], [28.62, 77.21], [28.61, 77.21]] }
      ];
      zoneLayerRef.current = createSeverityZones(mockZones);
      zoneLayerRef.current.addTo(map);
    }

    // 4. Officer Layer
    const officerConfig = activeLayers.find(l => l.id === 'officers');
    if (officerLayerRef.current) map.removeLayer(officerLayerRef.current);
    if (officerConfig?.enabled) {
      officerLayerRef.current = createOfficerLayer(officers);
      officerLayerRef.current.addTo(map);
    }

    // 5. Boundary Layer
    const boundaryConfig = activeLayers.find(l => l.id === 'boundaries');
    if (boundaryLayerRef.current) map.removeLayer(boundaryLayerRef.current);
    if (boundaryConfig?.enabled) {
      const mockWards = WARD_GEOJSON.features.map(f => ({
        name: f.properties.name,
        complaintCount: Math.floor(Math.random() * 100),
        boundary: f
      }));
      boundaryLayerRef.current = createBoundaryLayer(mockWards);
      boundaryLayerRef.current.addTo(map);
    }

    // 6. Pulse Layer
    const pulseConfig = activeLayers.find(l => l.id === 'pulse');
    if (pulseLayerRef.current) map.removeLayer(pulseLayerRef.current);
    if (pulseConfig?.enabled) {
      const pulseGroup = L.layerGroup();
      markers.filter(m => m.level === 'CRITICAL').forEach(m => {
        pulseGroup.addLayer(createEmergencyPulse([m.lat, m.lng]));
      });
      pulseLayerRef.current = pulseGroup;
      pulseLayerRef.current.addTo(map);
    }

  }, [markers, officers, activeLayers, role]);

  return (
    <div className="w-full h-full relative group">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Control Panel */}
      <MapControlPanel 
        layers={filteredLayers}
        onToggleLayer={toggleLayer}
        filters={{}}
        onFilterChange={() => {}}
        role={role}
      />

      {/* Area Intelligence Toast (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
        <AnimatePresence>
          {role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-indigo-900/90 backdrop-blur-md border border-indigo-500/30 p-3 rounded-xl shadow-2xl max-w-xs pointer-events-auto"
            >
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">AI Area Intel</span>
              </div>
              <p className="text-white text-xs leading-relaxed">
                Abnormal <span className="text-indigo-400 font-bold">Sanitation</span> spike detected in <span className="text-indigo-400 font-bold">Ward 12</span>. 
                Possible infrastructure failure.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .emergency-pulse {
          pointer-events: none;
        }
        .marker-cluster-custom {
          background: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
        }
      `}</style>
    </div>
  );
};

export default GeoIntelligenceMap;
