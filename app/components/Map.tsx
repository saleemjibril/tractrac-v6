import { useState, useEffect, useRef, memo } from "react";
import loader from "../googleMapsLoader";
import { getTrackedTractors } from "../apis/tracker";

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
}

interface TrackedGroup {
  title: string;
  items: TrackedDevice[];
}

const Map = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs to store markers and infoWindow to avoid recreating them
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const cachedIconRef = useRef<google.maps.Icon | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Google Maps library
        await loader.importLibrary("maps");

        // Initialize map with performance optimizations
        const mapOptions: google.maps.MapOptions = {
          center: new window.google.maps.LatLng(9.082, 8.6753),
          zoom: 6,
          // Performance optimizations
          gestureHandling: 'greedy',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
        };
        
        const documentMap = document?.getElementById("map") as HTMLElement;
        if (!documentMap) {
          throw new Error('Map container not found');
        }
        
        const newMap = new window.google.maps.Map(documentMap, mapOptions);

        // Create a single reusable InfoWindow
        infoWindowRef.current = new window.google.maps.InfoWindow();

        // Cache the marker icon to avoid repeated requests
        if (!cachedIconRef.current) {
          cachedIconRef.current = {
            url: "https://res.cloudinary.com/tractrac-global/image/upload/v1746446667/tractor-icon_nwbaf5.svg",
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20),
          };
        }

        // Fetch tracked tractors
        const tractorsResponse = await getTrackedTractors();
        console.log('Tractors response:', tractorsResponse);

        const fetchedDevices: TrackedDevice[] = [];

        // Extract devices from all groups
        if (tractorsResponse?.data && Array.isArray(tractorsResponse.data)) {
          tractorsResponse.data.forEach((group: TrackedGroup) => {
            if (group.items && Array.isArray(group.items)) {
              fetchedDevices.push(...group.items);
            }
          });
        }

        console.log('Loaded tractors:', fetchedDevices.length);

        // Create markers efficiently
        const bounds = new window.google.maps.LatLngBounds();
        let hasValidMarkers = false;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Batch marker creation
        const markers = fetchedDevices
          .filter(device => device.lat && device.lng)
          .map((device) => {
            const position = new window.google.maps.LatLng(device.lat, device.lng);
            
            const marker = new window.google.maps.Marker({
              position: position,
              map: newMap,
              title: device.name,
              icon: cachedIconRef.current!,
              optimized: true, // Enable marker optimization
            });

            // Use closure to capture device data efficiently
            marker.addListener("click", () => {
              // Generate content only when clicked
              const content = `
                <div style="padding: 8px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${device.name}</h3>
                  <p style="margin: 4px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: ${device.online === '1' ? '#22c55e' : '#ef4444'}">${device.online === '1' ? 'Online' : 'Offline'}</span></p>
                  <p style="margin: 4px 0; font-size: 12px;"><strong>Speed:</strong> ${device.speed} ${device.unit_of_distance}/h</p>
                  ${device.address ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${device.address}</p>` : ''}
                  <p style="margin: 4px 0; font-size: 12px;"><strong>Last Update:</strong> ${device.time}</p>
                </div>
              `;
              infoWindowRef.current!.setContent(content);
              infoWindowRef.current!.open(newMap, marker);
            });

            bounds.extend(position);
            hasValidMarkers = true;
            
            return marker;
          });

        markersRef.current = markers;

        // Adjust map bounds to show all markers
        if (hasValidMarkers) {
          newMap.fitBounds(bounds);
          
          // Set a maximum zoom level with a single listener
          const listener = window.google.maps.event.addListenerOnce(newMap, "idle", () => {
            const currentZoom = newMap.getZoom();
            if (currentZoom !== undefined && currentZoom > 15) {
              newMap.setZoom(15);
            }
          });
        }

        setMap(newMap);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load tractor locations');
        setLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '360px' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          background: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          Loading tractors...
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          background: '#fee',
          color: '#c00',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {error}
        </div>
      )}
      <div id="map" style={{ height: "360px" }}></div>
    </div>
  );
};

export default memo(Map);
