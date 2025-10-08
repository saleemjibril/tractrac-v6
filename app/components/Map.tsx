import { useState, useEffect, useRef, memo, useCallback } from "react";
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

type MarkersMap = Map<string, google.maps.Marker>;

const Map = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const markersMapRef = useRef<MarkersMap>(new (globalThis.Map)());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const cachedIconRef = useRef<google.maps.Icon | null>(null);
  const isMountedRef = useRef(true);
  const markerClustererRef = useRef<any>(null);
  const devicesDataRef = useRef<TrackedDevice[]>([]);
  const userLocationRef = useRef<google.maps.LatLng | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const openInfoWindowDeviceIdRef = useRef<number | null>(null);
  const POLLING_INTERVAL = 10000; // 10 seconds

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Function to get user's location
  const getUserLocation = useCallback((): Promise<google.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          userLocationRef.current = userLoc;
          resolve(userLoc);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000 // Cache location for 5 minutes
        }
      );
    });
  }, []);

  // Memoized info window content generator
  const generateInfoContent = useCallback((device: TrackedDevice) => {
    return `
      <div style="padding: 8px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${device.name}</h3>
        <p style="margin: 4px 0; font-size: 12px;"><strong>Speed:</strong> ${device.speed} ${device.unit_of_distance}/h</p>
        ${device.address ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${device.address}</p>` : ''}
        <p style="margin: 4px 0; font-size: 12px;"><strong>Last Update:</strong> ${device.time}</p>
      </div>
    `;
  }, []);

  // Optimized marker click handler
  const createMarkerClickHandler = useCallback((deviceId: number, marker: google.maps.Marker, mapInstance: google.maps.Map) => {
    return () => {
      if (!infoWindowRef.current) return;
      
      const device = devicesDataRef.current.find(d => d.id === deviceId);
      if (!device) return;
      
      infoWindowRef.current.setContent(generateInfoContent(device));
      infoWindowRef.current.open(mapInstance, marker);
      openInfoWindowDeviceIdRef.current = deviceId;
    };
  }, [generateInfoContent]);

  // Function to update tractor positions
  const updateTractorPositions = useCallback(async (mapInstance: google.maps.Map) => {
    try {
      console.log('Polling for tractor updates...');
      const tractorsResponse = await getTrackedTractors();

      if (!isMountedRef.current) return;

      const fetchedDevices: TrackedDevice[] = [];

      if (tractorsResponse?.data && Array.isArray(tractorsResponse.data)) {
        tractorsResponse.data.forEach((group: TrackedGroup) => {
          if (group.items && Array.isArray(group.items)) {
            fetchedDevices.push(...group.items);
          }
        });
      }

      // Update devices data
      devicesDataRef.current = fetchedDevices;
      console.log('Updated tractors:', fetchedDevices.length);

      const validDevices = fetchedDevices.filter(device => device.lat && device.lng);
      const existingMarkerIds = new Set<string>();
      const newMarkers: google.maps.Marker[] = [];

      // Update existing markers and add new ones
      validDevices.forEach((device) => {
        const markerId = `marker-${device.id}`;
        existingMarkerIds.add(markerId);
        const existingMarker = markersMapRef.current.get(markerId);
        const position = new window.google.maps.LatLng(device.lat, device.lng);

        if (existingMarker) {
          // Update existing marker position
          existingMarker.setPosition(position);
          existingMarker.setTitle(device.name);
        } else {
          // Create new marker for new tractors
          const newMarker = new window.google.maps.Marker({
            position: position,
            map: null, // Clusterer will handle it
            title: device.name,
            icon: cachedIconRef.current!,
            optimized: true,
            clickable: true,
          });

          newMarker.addListener("click", createMarkerClickHandler(device.id, newMarker, mapInstance));
          markersMapRef.current.set(markerId, newMarker);
          newMarkers.push(newMarker);
        }
      });

      // Remove markers for tractors that are no longer tracked
      const markersToRemove: string[] = [];
      markersMapRef.current.forEach((marker, markerId) => {
        if (!existingMarkerIds.has(markerId)) {
          marker.setMap(null);
          markersToRemove.push(markerId);
        }
      });
      markersToRemove.forEach(markerId => markersMapRef.current.delete(markerId));

      // Update clusterer with new markers if any
      if (newMarkers.length > 0 && markerClustererRef.current) {
        const allMarkers = Array.from(markersMapRef.current.values());
        markerClustererRef.current.clearMarkers();
        markerClustererRef.current.addMarkers(allMarkers);
      }

      // If info window is open, update its content
      if (infoWindowRef.current && openInfoWindowDeviceIdRef.current !== null) {
        const deviceId = openInfoWindowDeviceIdRef.current;
        const device = devicesDataRef.current.find(d => d.id === deviceId);
        if (device) {
          infoWindowRef.current.setContent(generateInfoContent(device));
        }
      }

    } catch (err) {
      console.error('Error updating tractor positions:', err);
    }
  }, [createMarkerClickHandler, generateInfoContent]);

  useEffect(() => {
    isMountedRef.current = true;

    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Google Maps libraries in parallel
        const [mapsLib, markerLib] = await Promise.all([
          loader.importLibrary("maps"),
          loader.importLibrary("marker")
        ]);

        if (!isMountedRef.current) return;

        // Initialize map with aggressive performance optimizations
        const mapOptions: google.maps.MapOptions = {
          center: new window.google.maps.LatLng(9.082, 8.6753),
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.SATELLITE, // Use satellite view by default
          gestureHandling: 'greedy',
          disableDefaultUI: true, // Disable all UI for better performance
          zoomControl: true,
          fullscreenControl: true,
          clickableIcons: false,
          disableDoubleClickZoom: false,
          minZoom: 5,
          maxZoom: 18,
          // Critical performance settings
          renderingType: google.maps.RenderingType.RASTER, // Use raster for better performance with many markers
        };
        
        const documentMap = document?.getElementById("map") as HTMLElement;
        if (!documentMap) {
          throw new Error('Map container not found');
        }
        
        const newMap = new window.google.maps.Map(documentMap, mapOptions);

        // Create reusable InfoWindow
        infoWindowRef.current = new window.google.maps.InfoWindow();
        
        // Add listener to clear the device ID when info window is closed
        infoWindowRef.current.addListener('closeclick', () => {
          openInfoWindowDeviceIdRef.current = null;
        });

        // Create optimized marker icon with smaller size
        if (!cachedIconRef.current) {
          cachedIconRef.current = {
            url: "/icons/Group.png",
            scaledSize: new window.google.maps.Size(32, 32), // Reduced from 40x40
            anchor: new window.google.maps.Point(16, 16),
          };
        }

        // Fetch tracked tractors
        const tractorsResponse = await getTrackedTractors();

        if (!isMountedRef.current) return;

        const fetchedDevices: TrackedDevice[] = [];

        if (tractorsResponse?.data && Array.isArray(tractorsResponse.data)) {
          tractorsResponse.data.forEach((group: TrackedGroup) => {
            if (group.items && Array.isArray(group.items)) {
              fetchedDevices.push(...group.items);
            }
          });
        }

        // Store devices data for later reference
        devicesDataRef.current = fetchedDevices;
        console.log('Loaded tractors:', fetchedDevices.length);

        // Clear existing markers
        if (markerClustererRef.current) {
          markerClustererRef.current.clearMarkers();
        }
        markersMapRef.current.forEach(marker => marker.setMap(null));
        markersMapRef.current.clear();

        // Filter valid devices once
        const validDevices = fetchedDevices.filter(device => device.lat && device.lng);
        
        if (validDevices.length === 0) {
          if (isMountedRef.current) {
            setMap(newMap);
            setLoading(false);
          }
          return;
        }

        // Create markers array for clustering
        const markers: google.maps.Marker[] = [];
        const bounds = new window.google.maps.LatLngBounds();

        // Batch create all markers synchronously (faster than RAF for this use case)
        validDevices.forEach((device) => {
          const position = new window.google.maps.LatLng(device.lat, device.lng);
          const markerId = `marker-${device.id}`;
          
          const marker = new window.google.maps.Marker({
            position: position,
            map: null, // Don't add to map yet - clusterer will handle it
            title: device.name,
            icon: cachedIconRef.current!,
            optimized: true,
            clickable: true,
          });

          // Add click listener
          marker.addListener("click", createMarkerClickHandler(device.id, marker, newMap));

          markersMapRef.current.set(markerId, marker);
          markers.push(marker);
          bounds.extend(position);
        });

        // Initialize MarkerClusterer for better performance with many markers
        // Load clustering library dynamically
        try {
          // @ts-expect-error - markerClusterer is a valid library but not in the TypeScript definitions
          const { MarkerClusterer } = await loader.importLibrary("markerClusterer") as any;
          
          markerClustererRef.current = new MarkerClusterer({
            map: newMap,
            markers: markers,
            algorithm: new (window as any).markerClusterer.SuperClusterAlgorithm({
              radius: 100, // Cluster radius in pixels
              maxZoom: 14, // Don't cluster at zoom levels above 14
            }),
            renderer: {
              render: ({ count, position }: any) => {
                // Custom cluster renderer for better performance
                return new google.maps.Marker({
                  position,
                  icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: Math.min(count / 10 + 10, 25), // Dynamic size based on count
                    fillColor: "#1a73e8",
                    fillOpacity: 0.8,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  },
                  label: {
                    text: String(count),
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                  zIndex: 1000 + count,
                });
              },
            },
          });
        } catch (clusterError) {
          console.warn('MarkerClusterer not available, adding markers directly:', clusterError);
          // Fallback: add markers directly to map
          markers.forEach(marker => marker.setMap(newMap));
        }

        // Fit bounds once after all markers are added
        newMap.fitBounds(bounds);
        
        // Try to get user location and zoom to closest tractor
        try {
          const userLocation = await getUserLocation();
          
          if (userLocation && validDevices.length > 0) {
            // Find closest tractor to user
            let closestDevice: TrackedDevice | null = null;
            let minDistance = Infinity;

            validDevices.forEach((device) => {
              const distance = calculateDistance(
                userLocation.lat(),
                userLocation.lng(),
                device.lat,
                device.lng
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                closestDevice = device;
              }
            });

            // Zoom to closest tractor
            if (closestDevice) {
              const closestPosition = new window.google.maps.LatLng(
                closestDevice.lat,
                closestDevice.lng
              );
              
              // Center on closest tractor with appropriate zoom
              newMap.setCenter(closestPosition);
              newMap.setZoom(22); // Good zoom level to see the tractor and surroundings
              
              // Optionally show info window for closest tractor
              const markerId = `marker-${closestDevice.id}`;
              const closestMarker = markersMapRef.current.get(markerId);
              if (closestMarker && infoWindowRef.current) {
                setTimeout(() => {
                  if (!isMountedRef.current || !infoWindowRef.current) return;
                  infoWindowRef.current.setContent(generateInfoContent(closestDevice!));
                  infoWindowRef.current.open(newMap, closestMarker);
                  openInfoWindowDeviceIdRef.current = closestDevice!.id;
                }, 500); // Small delay to ensure map is ready
              }

              console.log(`Zoomed to closest tractor: ${closestDevice.name} (${minDistance.toFixed(2)} km away)`);
            }
          }
        } catch (locationError) {
          console.log('Could not get user location, showing all tractors:', locationError);
          // Fallback to showing all tractors (already done with fitBounds above)
        }
        
        // Set maximum zoom with throttling (only if we didn't zoom to closest tractor)
        const idleListener = window.google.maps.event.addListenerOnce(newMap, "idle", () => {
          if (!isMountedRef.current) return;
          const currentZoom = newMap.getZoom();
          if (currentZoom !== undefined && currentZoom > 15) {
            newMap.setZoom(22);
          }
        });

        if (isMountedRef.current) {
          setMap(newMap);
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

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (markerClustererRef.current) {
        markerClustererRef.current.clearMarkers();
        markerClustererRef.current = null;
      }
      markersMapRef.current.forEach(marker => marker.setMap(null));
      markersMapRef.current.clear();
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [createMarkerClickHandler, generateInfoContent, getUserLocation, calculateDistance]);

  // Polling effect - starts after map is initialized
  useEffect(() => {
    if (!map) return;

    console.log(`Starting tractor position polling (every ${POLLING_INTERVAL / 1000}s)`);

    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      updateTractorPositions(map);
    }, POLLING_INTERVAL);

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        console.log('Stopping tractor position polling');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [map, updateTractorPositions, POLLING_INTERVAL]);

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