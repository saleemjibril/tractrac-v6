"use client";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "react-leaflet-markercluster/styles";
import MarkerClusterGroup from "react-leaflet-markercluster";
import {
  getTrackedTractors,
  flattenDevicesFromGetDevicesBody,
  reverseGeocode as reverseGeocodeAPI,
} from "../apis/tracker";
import { createCustomIcon } from "../leafletLoader";
import { LeafletStrictModeGate } from "./LeafletStrictModeGate";

interface TrackedDevice {
  id: number;
  name: string;
  online: string;
  alarm: string;
  time: string;
  timestamp: number;
  speed: number;
  lat: number;
  lng: number;
  course: string;
  power: string;
  altitude: number;
  address: string;
  protocol: string;
  driver: string;
  total_distance: number;
  unit_of_distance: string;
  state?: string;
  lga?: string;
}

type MapType = 'satellite' | 'hybrid' | 'roadmap' | 'terrain';

function FitBounds({ devices }: { devices: TrackedDevice[] }) {
  const map = useMap();

  useEffect(() => {
    if (devices.length > 0) {
      const validDevices = devices.filter(d => d.lat && d.lng);
      if (validDevices.length > 0) {
        const bounds = L.latLngBounds(
          validDevices.map(d => [d.lat, d.lng] as [number, number])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [devices, map]);

  return null;
}



const Map = () => {
  const [devices, setDevices] = useState<TrackedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<MapType>('roadmap');
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [openPopupDeviceId, setOpenPopupDeviceId] = useState<number | null>(null);
  
  const isMountedRef = useRef(true);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const geocodingCacheRef = useRef<Map<string, { state: string; lga: string }>>(new (globalThis.Map)());
  const POLLING_INTERVAL = 10000; // 10 seconds

  // Create custom marker icon
  const markerIcon = createCustomIcon({
    iconUrl: "https://api.tractrac.co/media/images/248b7dd1-92c1-4122-883f-68149ed9c1e5.png",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Function to reverse geocode
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<{ state: string; lga: string }> => {
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    
    const cached = geocodingCacheRef.current.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await reverseGeocodeAPI(lat, lng);
      
      if (response?.data?.location) {
        const location = response.data.location;
        const result = {
          state: location.state || location.county || 'Unknown',
          lga: location.city || 'Unknown'
        };
        
        geocodingCacheRef.current.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn('Reverse geocoding error:', error);
    }
    
    return { state: 'Unknown', lga: 'Unknown' };
  }, []);

  // Generate popup content
  const generatePopupContent = useCallback((device: TrackedDevice, isLoading: boolean = false) => {
    if (isLoading) {
      return (
        <div style={{ padding: "8px", minWidth: "200px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "bold" }}>{device.name}</h3>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>Loading location...</p>
        </div>
      );
    }
    return (
      <div style={{ padding: "8px", minWidth: "200px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "bold" }}>{device.name}</h3>
        {device.state && <p style={{ margin: "4px 0", fontSize: "12px" }}><strong>State:</strong> {device.state}</p>}
        {device.lga && <p style={{ margin: "4px 0", fontSize: "12px" }}><strong>Local Government:</strong> {device.lga}</p>}
      </div>
    );
  }, []);

  // Handle marker click with lazy geocoding
  const handleMarkerClick = useCallback(async (device: TrackedDevice) => {
    setOpenPopupDeviceId(device.id);
    
    // If device needs geocoding, fetch it
    if ((!device.state || !device.lga) && device.lat && device.lng) {
      try {
        const location = await reverseGeocode(device.lat, device.lng);
        
        // Update device in state
        setDevices(prevDevices => 
          prevDevices.map(d => 
            d.id === device.id 
              ? { ...d, state: location.state, lga: location.lga }
              : d
          )
        );
      } catch (error) {
        console.warn(`Failed to geocode device ${device.id}:`, error);
      }
    }
  }, [reverseGeocode]);

  // Fetch and update tractor positions
  const updateTractorPositions = useCallback(async () => {
    try {
      console.log('Polling for tractor updates...');
      const tractorsResponse = await getTrackedTractors();

      if (!isMountedRef.current) return;

      const fetchedDevices = flattenDevicesFromGetDevicesBody(
        tractorsResponse?.data
      ) as TrackedDevice[];

      setDevices(fetchedDevices);
      console.log('Updated tractors:', fetchedDevices.length);
    } catch (err) {
      console.error('Error updating tractor positions:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    isMountedRef.current = true;

    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);

        await updateTractorPositions();

        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        if (isMountedRef.current) {
          setError('Failed to load tractor locations');
          setLoading(false);
        }
      }
    };

    initializeMap();

    return () => {
      isMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [updateTractorPositions]);

  // Polling effect
  useEffect(() => {
    console.log(`Starting tractor position polling (every ${POLLING_INTERVAL / 1000}s)`);

    pollingIntervalRef.current = setInterval(() => {
      updateTractorPositions();
    }, POLLING_INTERVAL);

    return () => {
      if (pollingIntervalRef.current) {
        console.log('Stopping tractor position polling');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [updateTractorPositions]);

  // Handle map type change
  const handleMapTypeChange = useCallback((newType: MapType) => {
    setMapType(newType);
  }, []);

  // Get tile layer URL based on map type
  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        // Using Esri World Imagery for satellite view
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case 'hybrid':
        // Using CartoDB Positron for a lighter hybrid-like view
        return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      case 'terrain':
        // Using OpenTopoMap for terrain
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      case 'roadmap':
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapType) {
      case 'satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'hybrid':
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
      case 'terrain':
        return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
      case 'roadmap':
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  const validDevices = devices.filter(device => device.lat && device.lng);

  return (
    <div style={{ position: 'relative', height: '360px' }}>
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: '#fee',
          color: '#c00',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {error}
        </div>
      )}
      
      {/* Map Type Selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {(['satellite', 'hybrid', 'roadmap', 'terrain'] as MapType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleMapTypeChange(type)}
            style={{
              padding: '8px 12px',
              border: 'none',
              background: mapType === type ? '#FA9411' : 'white',
              color: mapType === type ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: mapType === type ? 'bold' : 'normal',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
              borderRight: type !== 'terrain' ? '1px solid #e0e0e0' : 'none'
            }}
            onMouseEnter={(e) => {
              if (mapType !== type) {
                e.currentTarget.style.background = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (mapType !== type) {
                e.currentTarget.style.background = 'white';
              }
            }}
          >
            {type === 'roadmap' ? 'Normal' : type}
          </button>
        ))}
      </div>

      <LeafletStrictModeGate style={{ height: "100%", width: "100%" }}>
        <MapContainer
          center={[9.082, 8.6753]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
        <TileLayer
          attribution={getTileLayerAttribution()}
          url={getTileLayerUrl()}
        />
        
        {validDevices.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            maxClusterRadius={50}
          >
            {validDevices.map((device) => (
              <Marker
                key={device.id}
                position={[device.lat, device.lng]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(device),
                }}
              >
                <Popup>
                  {generatePopupContent(device, !device.state || !device.lga)}
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
        
        <FitBounds devices={devices} />
        </MapContainer>
      </LeafletStrictModeGate>
    </div>
  );
};

export default memo(Map);
