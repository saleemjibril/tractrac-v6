import { useState, useEffect, useRef } from "react";
import loader from "../googleMapsLoader";

interface Coordinate {
  lat: number;
  lng: number;
  title?: string; // Optional title for the marker
}

const ToolMap = ({ coordinates }: { coordinates: Coordinate[] }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Clean up markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  // Create markers from coordinates
  const createMarkers = (map: google.maps.Map, coords: Coordinate[]) => {
    clearMarkers();

    coords.forEach((coord, index) => {
      const marker = new google.maps.Marker({
        position: { lat: coord.lat, lng: coord.lng },
        map: map,
        title: coord.title || `Location ${index + 1}`,
        icon: {
          url: "https://res.cloudinary.com/thewebplug/image/upload/v1751460708/WhatsApp_Image_2025-06-25_at_17.19.08_hl0em3.jpg",
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      // Optional: Add click listener for marker info
      marker.addListener("click", () => {
        console.log(`Clicked marker at: ${coord.lat}, ${coord.lng}`);
        // You can add an InfoWindow here if needed
      });

      markersRef.current.push(marker);
    });
  };

  // Calculate center point from coordinates
  const calculateCenter = (coords: Coordinate[]): google.maps.LatLngLiteral => {
    if (coords.length === 0) {
      return { lat: 9.082, lng: 8.6753 }; // Default center (Nigeria)
    }

    if (coords.length === 1) {
      return { lat: coords[0].lat, lng: coords[0].lng };
    }

    const totalLat = coords.reduce((sum, coord) => sum + coord.lat, 0);
    const totalLng = coords.reduce((sum, coord) => sum + coord.lng, 0);

    return {
      lat: totalLat / coords.length,
      lng: totalLng / coords.length,
    };
  };

  useEffect(() => {
    if (!coordinates.length) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        await loader.importLibrary("maps");
        
        if (!mapRef.current) return;

        const center = calculateCenter(coordinates);
        
        const mapOptions: google.maps.MapOptions = {
          center: center,
          zoom: coordinates.length === 1 ? 15 : 6, // Zoom in more for single location
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        };

        const newMap = new google.maps.Map(mapRef.current, mapOptions);
        
        // Create markers
        createMarkers(newMap, coordinates);

        // Adjust map bounds to fit all markers (if more than one)
        if (coordinates.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          coordinates.forEach(coord => {
            bounds.extend({ lat: coord.lat, lng: coord.lng });
          });
          newMap.fitBounds(bounds);
          
          // Add some padding to the bounds
          const padding = { top: 50, right: 50, bottom: 50, left: 50 };
          newMap.fitBounds(bounds, padding);
        }

        setMap(newMap);
      } catch (error) {
        console.error("Failed to initialize map:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      clearMarkers();
    };
  }, [coordinates]);

  return (
    <div style={{ position: "relative" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Loading map...
        </div>
      )}
      <div
        ref={mapRef}
        id="map"
        style={{ 
          height: "360px", 
          width: "100%",
          opacity: isLoading ? 0.5 : 1,
          transition: "opacity 0.3s ease-in-out"
        }}
      />
      {!isLoading && coordinates.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#666",
          }}
        >
          No coordinates provided
        </div>
      )}
    </div>
  );
};

export default ToolMap;