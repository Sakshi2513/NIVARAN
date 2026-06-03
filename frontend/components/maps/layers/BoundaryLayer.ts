import L from 'leaflet';

export function createBoundaryLayer(wards: any[]) {
  const layer = L.layerGroup();

  wards.forEach(w => {
    const geojson = L.geoJSON(w.boundary, {
      style: {
        color: '#4f46e5',
        weight: 2,
        opacity: 0.4,
        fillColor: '#4f46e5',
        fillOpacity: 0.05
      },
      onEachFeature: (feature, l) => {
        l.bindTooltip(`
          <div class="p-1 font-sans">
            <p class="font-bold text-xs uppercase">${w.name}</p>
            <p class="text-[10px] text-slate-500">${w.complaintCount} Complaints</p>
          </div>
        `, { sticky: true });

        l.on('mouseover', function (e) {
          const target = e.target;
          target.setStyle({
            fillOpacity: 0.2,
            weight: 3,
            opacity: 0.8
          });
        });

        l.on('mouseout', function (e) {
          const target = e.target;
          target.setStyle({
            fillOpacity: 0.05,
            weight: 2,
            opacity: 0.4
          });
        });

        l.on('click', () => {
          // Could trigger a ward details panel
        });
      }
    });

    layer.addLayer(geojson);
  });

  return layer;
}
