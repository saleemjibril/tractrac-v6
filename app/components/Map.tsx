import { useState, useEffect, useRef, useCallback } from "react";
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

interface MapProps {
  pollingInterval?: number;
}

const Map = ({ pollingInterval = 300000 }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const activeInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const isUpdatingRef = useRef(false);

  const updateMarkers = useCallback(async (mapInstance: google.maps.Map) => {
    // Prevent concurrent updates
    if (isUpdatingRef.current) {
      console.log('Map: Update already in progress, skipping...');
      return;
    }
    
    isUpdatingRef.current = true;
    
    try {
      // Fetch tracked tractors
      const tractorsResponse = await getTrackedTractors();
      console.log('Map: Tractors response:', tractorsResponse);
      
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Close active info window when updating
      if (activeInfoWindowRef.current) {
        activeInfoWindowRef.current.close();
        activeInfoWindowRef.current = null;
      }

      // Extract devices from all groups
      const devices: TrackedDevice[] = [];
      if (tractorsResponse?.data && Array.isArray(tractorsResponse.data)) {
        tractorsResponse.data.forEach((group: TrackedGroup) => {
          if (group.items && Array.isArray(group.items)) {
            devices.push(...group.items);
          }
        });
      }
      
      console.log('Map: Extracted devices:', devices.length, devices);

      // Create markers for each device
      devices.forEach((device) => {
        if (device.lat && device.lng) {
          console.log('Map: Creating marker for device:', device.name, 'at', device.lat, device.lng);
          
          const marker = new window.google.maps.Marker({
            position: { lat: device.lat, lng: device.lng },
            map: mapInstance,
            icon: {
              url: "https://res.cloudinary.com/tractrac-global/image/upload/v1746446667/tractor-icon_nwbaf5.svg",
              scaledSize: new window.google.maps.Size(32, 32),
            },
            title: device.name || `Tractor ${device.id}`,
          });

          // Create info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold;">${device.name || `Tractor ${device.id}`}</h3>
                <p style="margin: 4px 0;"><strong>Status:</strong> ${device.online === "1" ? "Online" : "Offline"}</p>
                <p style="margin: 4px 0;"><strong>Speed:</strong> ${device.speed} ${device.unit_of_distance}/h</p>
                <p style="margin: 4px 0;"><strong>Address:</strong> ${device.address || "N/A"}</p>
                <p style="margin: 4px 0;"><strong>Last Update:</strong> ${device.time}</p>
              </div>
            `,
          });

          // Add click listener
          marker.addListener("click", () => {
            // Close previously active info window
            if (activeInfoWindowRef.current) {
              activeInfoWindowRef.current.close();
            }
            
            // Open new info window
            infoWindow.open(mapInstance, marker);
            activeInfoWindowRef.current = infoWindow;
          });

          markersRef.current.push(marker);
        } else {
          console.log('Map: Skipping device (no lat/lng):', device.name, device);
        }
      });
      
      console.log('Map: Total markers created:', markersRef.current.length);

      // Auto-fit bounds to show all markers
      if (markersRef.current.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        markersRef.current.forEach((marker) => {
          const position = marker.getPosition();
          if (position) {
            bounds.extend(position);
          }
        });
        mapInstance.fitBounds(bounds);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching tracked tractors:", error);
      setError("Failed to load tractor locations. Please try again.");
    } finally {
      isUpdatingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let mounted = true;

    const initializeMap = async () => {
      try {
        await loader.importLibrary("maps");
        
        if (!mounted) return;

        const mapOptions: google.maps.MapOptions = {
          center: new window.google.maps.LatLng(9.082, 8.6753),
          zoom: 6,
        };
        
        const documentMap = document?.getElementById("map") as HTMLElement;
        
        if (!documentMap) {
          setError("Map container not found");
          setIsLoading(false);
          return;
        }

        const newMap = new window.google.maps.Map(documentMap, mapOptions);
        setMap(newMap);

        // Initial load
        await updateMarkers(newMap);

        // Setup polling if interval is provided and greater than 0
        if (pollingInterval > 0) {
          pollInterval = setInterval(() => {
            if (mounted) {
              updateMarkers(newMap);
            }
          }, pollingInterval);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        setError("Failed to load Google Maps. Please refresh the page.");
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      mounted = false;
      
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      
      // Close active info window
      if (activeInfoWindowRef.current) {
        activeInfoWindowRef.current.close();
        activeInfoWindowRef.current = null;
      }
      
      // Clear markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [pollingInterval, updateMarkers]);

  if (error) {
    return (
      <div style={{ 
        height: "360px", 
        width: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
        borderRadius: "4px"
      }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#d32f2f", marginBottom: "8px" }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "360px", width: "100%" }}>
      {isLoading && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 1000
        }}>
          <p>Loading map...</p>
        </div>
      )}
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
};

export default Map;