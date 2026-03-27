// Leaflet configuration and initialization
// Leaflet is free and open-source, no API key required

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js/SSR
if (typeof window !== 'undefined') {
  // Fix for default marker icon
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Default map options
export const defaultMapOptions: L.MapOptions = {
  center: [9.082, 8.6753], // Default center (Nigeria)
  zoom: 6,
  zoomControl: true,
};

// Helper to create custom icon
export const createCustomIcon = (options?: {
  iconUrl?: string;
  iconRetinaUrl?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  /** Omit shadow for flat / square assets (default shadow is sized for the stock teardrop pin). */
  shadowUrl?: string | null;
}): L.Icon => {
  const defaultIconUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
  const defaultRetinaUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
  const defaultShadowUrl =
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

  const iconUrl = options?.iconUrl ?? defaultIconUrl;
  const isCustom = Boolean(options?.iconUrl);

  // Leaflet uses iconRetinaUrl on high-DPI screens when it is set. We must not leave the
  // stock retina URL when iconUrl is custom, or users only see the default pin on retina.
  const iconRetinaUrl = options?.iconRetinaUrl
    ? options.iconRetinaUrl
    : isCustom
      ? iconUrl
      : defaultRetinaUrl;

  const shadowUrl =
    options?.shadowUrl === null
      ? undefined
      : options?.shadowUrl !== undefined
        ? options.shadowUrl
        : isCustom
          ? undefined
          : defaultShadowUrl;

  return L.icon({
    iconUrl,
    iconRetinaUrl,
    ...(shadowUrl !== undefined ? { shadowUrl } : {}),
    iconSize: options?.iconSize || [25, 41],
    iconAnchor: options?.iconAnchor || [12, 41],
    popupAnchor: options?.popupAnchor || [1, -34],
  });
};

export default L;




