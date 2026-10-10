import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const colorFor = (p) => ({ Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' }[p] || '#3b66f6');

function markerIcon(priority, pulse) {
  const c = colorFor(priority);
  return L.divIcon({
    className: 'custom-pin',
    html: `<div class="${pulse ? 'marker-pulse' : ''}" style="width:22px;height:22px;border-radius:9999px;background:${c};border:3px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,.35)"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function Fit({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points?.length) {
      const b = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(b.pad(0.3));
    }
  }, [points, map]);
  return null;
}

export const CAMPUS_CENTER = [28.6139, 77.209]; // Demo default (New Delhi). Change to your campus.

export default function IncidentMap({ incidents = [], onSelect, height = '420px', center = CAMPUS_CENTER }) {
  const points = incidents.filter(i => i.coordinates?.lat && i.coordinates?.lng)
    .map(i => ({ lat: i.coordinates.lat, lng: i.coordinates.lng }));
  return (
    <MapContainer center={center} zoom={15} style={{ height, width: '100%' }} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Fit points={points} />
      {incidents.filter(i => i.coordinates?.lat).map(i => (
        <Marker key={i._id || i.incidentId} position={[i.coordinates.lat, i.coordinates.lng]}
          icon={markerIcon(i.priority, i.priority === 'Critical' && i.status !== 'Resolved')}>
          <Popup>
            <b>{i.incidentId}</b> · {i.category}<br />
            {i.locationName}<br />
            Priority: <b>{i.priority}</b> · Status: <b>{i.status}</b>
          </Popup>
        </Marker>
      ))}
      {onSelect && <ClickCatcher onSelect={onSelect} />}
    </MapContainer>
  );
}

import { useMapEvents } from 'react-leaflet';
function ClickCatcher({ onSelect }) {
  useMapEvents({ click(e) { onSelect({ lat: e.latlng.lat, lng: e.latlng.lng }); } });
  return null;
}
