"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { LeafletStrictModeGate } from "../components/LeafletStrictModeGate";
import { OFFICES, type Office } from "./contactData";
import styles from "./contact.module.css";

function FitBounds({ offices }: { offices: Office[] }) {
  const map = useMap();

  useEffect(() => {
    if (offices.length > 0) {
      const bounds = L.latLngBounds(
        offices.map(
          (office) => [office.position.lat, office.position.lng] as [number, number]
        )
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [offices, map]);

  return null;
}

export default function ContactMap() {
  return (
    <div className={styles.mapWrap}>
      <LeafletStrictModeGate className={styles.mapContainer}>
        <MapContainer
          center={[9.082, 8.6753]}
          zoom={6}
          style={{ height: "100%", width: "100%", minHeight: "420px" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {OFFICES.map((office) => (
            <Marker
              key={office.id}
              position={[office.position.lat, office.position.lng]}
            >
              <Popup>
                <div style={{ padding: "8px", maxWidth: "260px" }}>
                  <strong style={{ display: "block", marginBottom: "6px" }}>
                    {office.name}
                    {office.placeholder ? " (Coming soon)" : ""}
                  </strong>
                  <span style={{ fontSize: "13px", lineHeight: 1.4 }}>{office.address}</span>
                </div>
              </Popup>
            </Marker>
          ))}
          <FitBounds offices={OFFICES} />
        </MapContainer>
      </LeafletStrictModeGate>
    </div>
  );
}
