import L from 'leaflet';
import { ComplaintSeverity } from '../../types';

export interface MapLayerConfig {
  id: string;
  name: string;
  enabled: boolean;
  type: 'cluster' | 'heatmap' | 'zones' | 'officers' | 'boundaries' | 'pulse';
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: any;
  geometry: {
    type: 'Polygon' | 'MultiPolygon' | 'Point';
    coordinates: any;
  };
}

export interface WardData {
  id: string;
  name: string;
  complaintCount: number;
  avgResolutionTime: string;
  performance: number; // 0-100
  emergencyDensity: number; // 0-100
  boundary: GeoJSONFeature;
}

export interface OfficerLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'BUSY' | 'EMERGENCY_RESPONSE';
  assignedRoute?: [number, number][];
  lastUpdate: string;
}
