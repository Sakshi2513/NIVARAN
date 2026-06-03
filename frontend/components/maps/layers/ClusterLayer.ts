import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const getClusterColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return '#ef4444';
    case 'HIGH': return '#f59e0b';
    case 'MEDIUM': return '#3b82f6';
    default: return '#10b981';
  }
};

export function createClusterLayer(complaints: any[]) {
  const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: (cluster) => {
      const childCount = cluster.getChildCount();
      const children = cluster.getAllChildMarkers();
      
      // Determine dominant severity
      const severities = children.map((m: any) => m.options.severity || 'LOW');
      const counts: any = {};
      severities.forEach(s => counts[s] = (counts[s] || 0) + 1);
      const dominant = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      const color = getClusterColor(dominant);

      return L.divIcon({
        html: `
          <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg" style="background: ${color}">
            <span class="text-white text-xs font-bold">${childCount}</span>
          </div>
        `,
        className: 'marker-cluster-custom',
        iconSize: L.point(40, 40)
      });
    }
  });

  complaints.forEach(c => {
    if (typeof c.lat !== 'number' || typeof c.lng !== 'number') return;
    
    const color = getClusterColor(c.level);
    const isCritical = c.level === 'CRITICAL';
    const pulseClass = isCritical ? 'animate-pulse' : '';
    
    const marker = L.marker([c.lat, c.lng], {
      severity: c.level,
      icon: L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            ${isCritical ? `<div class="absolute w-6 h-6 bg-red-500 rounded-full animate-ping opacity-20"></div>` : ''}
            <div class="${pulseClass}" style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px ${color}"></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    } as any);

    marker.bindPopup(`
      <div class="p-3 font-sans min-w-[200px]">
        <div class="flex items-center justify-between mb-2">
           <span class="text-[8px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded uppercase">Issue Intel</span>
           <span class="text-[8px] font-bold text-slate-500 uppercase">${c.status || 'Active'}</span>
        </div>
        <h3 class="font-bold text-sm text-slate-900 dark:text-white leading-tight mb-1">${c.title}</h3>
        <p class="text-[10px] text-slate-500 font-medium mb-3">${c.level} SEVERITY</p>
        
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
           <p class="text-[9px] text-slate-400 font-bold uppercase mb-1">Last Updated</p>
           <p class="text-[10px] font-bold text-slate-900 dark:text-white">Recently (Live Stream)</p>
        </div>
      </div>
    `, { className: 'nia-map-popup' });
    
    markers.addLayer(marker);
  });

  return markers;
}
