'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  city?: string;
}

const Map = ({ latitude, longitude, city }: MapProps) => {
  useEffect(() => {
    // Correction du problème d'icône de marqueur par défaut
    const icon = new Icon({
      iconUrl: '/marker-icon.png',
      iconRetinaUrl: '/marker-icon-2x.png',
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // @ts-ignore
    L.Marker.prototype.options.icon = icon;
  }, []);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>
          {city || `${latitude}, ${longitude}`}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map; 

