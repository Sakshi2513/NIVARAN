import L from 'leaflet';
import 'leaflet.heat';

export function createHeatmapLayer(data: { lat: number, lng: number, intensity: number }[], options: any = {}) {
  const points = data.map(p => [p.lat, p.lng, p.intensity]);
  
  // @ts-ignore - L.heatLayer is added by leaflet.heat
  return L.heatLayer(points, {
    radius: 35,
    blur: 20,
    maxZoom: 17,
    max: options.max || 1.0,
    gradient: {
      0.2: '#10b981', // Emerald/Green
      0.4: '#f59e0b', // Amber/Yellow
      0.6: '#f97316', // Orange
      0.9: '#ef4444'  // Red
    },
    ...options
  });
}
