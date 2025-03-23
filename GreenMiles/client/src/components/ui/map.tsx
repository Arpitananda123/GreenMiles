import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: [number, number];
  zoom: number;
  markers?: Array<{
    position: [number, number];
    type: 'charging' | 'start' | 'end';
    info?: {
      name: string;
      renewablePercentage: number;
      available: boolean;
    };
  }>;
  routes?: Array<{
    points: Array<[number, number]>;
    color: string;
  }>;
}

export default function Map({ center, zoom, markers = [], routes = [] }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Clean up on component unmount
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (mapRef.current) {
      // Clear existing markers
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current?.removeLayer(layer);
        }
      });
      
      // Add markers
      markers.forEach(marker => {
        const { position, type, info } = marker;
        let icon;
        
        if (type === 'charging') {
          // Custom charging station icon
          const iconHtml = `
            <div class="charging-marker ${info?.available ? 'available' : 'unavailable'}">
              <div class="percentage">${info?.renewablePercentage || 0}%</div>
            </div>
          `;
          
          icon = L.divIcon({
            html: iconHtml,
            className: 'charging-icon',
            iconSize: [32, 32]
          });
        } else if (type === 'start') {
          // Start point icon
          icon = L.divIcon({
            html: `<div class="start-marker"></div>`,
            className: 'route-marker',
            iconSize: [12, 12]
          });
        } else if (type === 'end') {
          // End point icon
          icon = L.divIcon({
            html: `<div class="end-marker"></div>`,
            className: 'route-marker',
            iconSize: [12, 12]
          });
        }
        
        if (icon) {
          const markerObj = L.marker(position, { icon }).addTo(mapRef.current!);
          
          // Add popup for charging stations
          if (type === 'charging' && info) {
            markerObj.bindPopup(`
              <div>
                <strong>${info.name || 'Charging Station'}</strong><br>
                Renewable Energy: ${info.renewablePercentage}%<br>
                Status: ${info.available ? 'Available' : 'In Use'}
              </div>
            `);
          }
        }
      });
      
      // Add routes
      routes.forEach(route => {
        L.polyline(route.points, {
          color: route.color,
          weight: 3,
          dashArray: '8, 4'
        }).addTo(mapRef.current!);
      });
    }
  }, [markers, routes]);

  return (
    <div ref={mapContainerRef} className="h-full w-full rounded-lg" />
  );
}
