"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { createCustomIcon } from "../leafletLoader";
import { LeafletStrictModeGate } from "./LeafletStrictModeGate";

interface Coordinate {
  lat: number;
  lng: number;
  title?: string;
}

function FitBounds({ coordinates }: { coordinates: Coordinate[] }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 1) {
      const bounds = L.latLngBounds(
        coordinates.map(coord => [coord.lat, coord.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (coordinates.length === 1) {
      map.setView([coordinates[0].lat, coordinates[0].lng], 15);
    }
  }, [coordinates, map]);

  return null;
}

const ToolMap = ({ coordinates }: { coordinates: Coordinate[] }) => {
  if (!coordinates.length) {
    return (
      <div style={{ 
        height: "360px", 
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#666"
      }}>
        No coordinates provided
      </div>
    );
  }

  // Calculate center point from coordinates
  const calculateCenter = (coords: Coordinate[]): [number, number] => {
    if (coords.length === 0) {
      return [9.082, 8.6753]; // Default center (Nigeria)
    }

    if (coords.length === 1) {
      return [coords[0].lat, coords[0].lng];
    }

    const totalLat = coords.reduce((sum, coord) => sum + coord.lat, 0);
    const totalLng = coords.reduce((sum, coord) => sum + coord.lng, 0);

    return [
      totalLat / coords.length,
      totalLng / coords.length,
    ];
  };

  const center = calculateCenter(coordinates);
  const zoom = coordinates.length === 1 ? 15 : 6;

  // Custom icon for markers
  const customIcon = createCustomIcon({
    iconUrl: "https://res.cloudinary.com/thewebplug/image/upload/v1751460708/WhatsApp_Image_2025-06-25_at_17.19.08_hl0em3.jpg",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <div style={{ position: "relative", height: "360px", width: "100%" }}>
      <LeafletStrictModeGate style={{ height: "100%", width: "100%" }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            position={[coord.lat, coord.lng]}
            icon={customIcon}
          >
            {coord.title && (
              <Popup>
                {coord.title}
              </Popup>
            )}
          </Marker>
        ))}
        <FitBounds coordinates={coordinates} />
        </MapContainer>
      </LeafletStrictModeGate>
    </div>
  );
};

export default ToolMap;
