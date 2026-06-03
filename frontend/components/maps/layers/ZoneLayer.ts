import L from 'leaflet';

export function createSeverityZones(zones: any[]) {
  const layer = L.layerGroup();

  zones.forEach(z => {
    const color = z.level === 'CRITICAL' ? '#ef4444' : z.level === 'HIGH' ? '#f59e0b' : '#3b82f6';
    const polygon = L.polygon(z.coordinates, {
      color: color,
      fillColor: color,
      fillOpacity: 0.15,
      weight: 1,
      dashArray: '5, 5'
    });

    polygon.bindTooltip(`Risk Zone: ${z.level}`, { sticky: true });
    layer.addLayer(polygon);
  });

  return layer;
}

export function createEmergencyPulse(center: [number, number], level: string = 'CRITICAL') {
  const color = level === 'CRITICAL' ? '#ef4444' : '#f59e0b';
  
  // Custom pulsing icon using CSS
  const pulseIcon = L.divIcon({
    className: 'emergency-pulse',
    html: `
      <div class="relative w-12 h-12">
        <div class="absolute inset-0 rounded-full bg-${level === 'CRITICAL' ? 'red' : 'amber'}-500 opacity-20 animate-ping"></div>
        <div class="absolute inset-2 rounded-full bg-${level === 'CRITICAL' ? 'red' : 'amber'}-600 opacity-40 animate-pulse"></div>
        <div class="absolute inset-4 rounded-full bg-${level === 'CRITICAL' ? 'red' : 'amber'}-500 border-2 border-white shadow-xl"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });

  return L.marker(center, { icon: pulseIcon });
}
