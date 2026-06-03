import L from 'leaflet';

export function createOfficerLayer(officers: any[]) {
  const layer = L.layerGroup();

  officers.forEach(o => {
    const statusColor = {
      'AVAILABLE': '#10b981',
      'ASSIGNED': '#3b82f6',
      'BUSY': '#f59e0b',
      'EMERGENCY_RESPONSE': '#ef4444'
    }[o.status as string] || '#64748b';

    const icon = L.divIcon({
      html: `
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden bg-slate-800 flex items-center justify-center">
             <span class="text-[10px] text-white font-bold">${o.name.charAt(0)}</span>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase shadow-sm" style="background: ${statusColor}">
            ${o.status.replace('_', ' ')}
          </div>
        </div>
      `,
      className: 'officer-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 25]
    });

    const marker = L.marker([o.lat, o.lng], { icon });
    
    let popupContent = `
      <div class="p-2 min-w-[150px]">
        <h4 class="font-bold text-sm text-slate-800">${o.name}</h4>
        <p class="text-xs text-slate-500 mb-2">${o.role || 'Field Officer'}</p>
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2 h-2 rounded-full" style="background: ${statusColor}"></span>
          <span class="text-[10px] font-bold uppercase">${o.status}</span>
        </div>
    `;

    if (o.assignedRoute) {
      const polyline = L.polyline(o.assignedRoute, {
        color: statusColor,
        weight: 3,
        opacity: 0.6,
        dashArray: '10, 10'
      });
      layer.addLayer(polyline);
      popupContent += `<p class="text-[10px] text-blue-600 font-bold">ROUTE ACTIVE</p>`;
    }

    popupContent += `</div>`;
    marker.bindPopup(popupContent);
    layer.addLayer(marker);
  });

  return layer;
}
