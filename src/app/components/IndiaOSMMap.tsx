import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode } from "react";

interface IndiaOSMMapProps {
  zoom?: number;
  onMapClick?: (e: { lat: number; lng: number }) => void;
  children?: ReactNode;
  mapLayers?: ReactNode;
}

function MapEvents({ onClick }: { onClick?: (e: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng);
    },
  });
  return null;
}

export default function IndiaOSMMap({ zoom = 1, onMapClick, children, mapLayers }: IndiaOSMMapProps) {
  return (
    <div
      className="relative rounded-lg border-2 border-green-600/40 cursor-crosshair hover:border-green-500/60 transition-all shadow-2xl overflow-hidden"
      style={{
        width: `${60 * zoom}%`,
        height: `${80 * zoom}%`,
        maxWidth: "90%",
        maxHeight: "90%",
        transition: "all 0.3s",
        boxShadow: "0 0 60px rgba(34, 197, 94, 0.15)",
      }}
    >
      {/* OpenStreetMap */}
      <MapContainer
        center={[22.5937, 78.9629]} // India center
        zoom={5}
        minZoom={3}
        maxZoom={18}
        zoomControl={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />
        <MapEvents onClick={onMapClick} />
        {mapLayers}
      </MapContainer>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-[1]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-[2]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Children elements (UI overlays) */}
      <div className="absolute inset-0 z-[10] pointer-events-none">
        {children}
      </div>
    </div>
  );
}
