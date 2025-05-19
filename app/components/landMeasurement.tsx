// components/LandMeasurement.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Dynamically import the React Leaflet components with no SSR
const MapContainer = dynamic<MapContainerProps>(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Polygon = dynamic(
  () => import('react-leaflet').then(mod => mod.Polygon),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);

type Coordinate = [number, number]; // [latitude, longitude]

export default function LandMeasurement(): JSX.Element {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [area, setArea] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Coordinate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Start recording GPS coordinates
  const startRecording = (): void => {
    setError(null);
    setCoordinates([]);
    setArea(null);
    setIsRecording(true);
    
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          setCoordinates(prev => [...prev, [latitude, longitude]]);
        },
        (err: GeolocationPositionError) => {
          setError(`Error: ${err.message}`);
          setIsRecording(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0 
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsRecording(false);
    }
  };

  // Stop recording GPS coordinates
  const stopRecording = (): void => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsRecording(false);
    
    // Calculate area if we have at least 3 points
    if (coordinates.length >= 3) {
      const areaInSquareMeters = calculatePolygonArea(coordinates);
      setArea(areaInSquareMeters);
    } else {
      setError("Need at least 3 points to calculate area.");
    }
  };

  // Calculate the area of a polygon using the Shoelace formula
  const calculatePolygonArea = (coords: Coordinate[]): number => {
    // Convert latitude/longitude to UTM coordinates for more accurate area calculation
    const utmCoords = coords.map(coord => latLngToUTM(coord[0], coord[1]));
    
    let area = 0;
    for (let i = 0; i < utmCoords.length; i++) {
      const j = (i + 1) % utmCoords.length;
      area += utmCoords[i][0] * utmCoords[j][1];
      area -= utmCoords[j][0] * utmCoords[i][1];
    }
    
    return Math.abs(area / 2);
  };

  // Convert latitude/longitude to UTM coordinates (simplified version)
  const latLngToUTM = (lat: number, lng: number): [number, number] => {
    // This is a simplified conversion and not accurate for all locations
    // In a real app, you'd want to use a proper coordinate conversion library
    const earthRadius = 6378137; // meters
    const x = lng * (Math.PI / 180) * earthRadius;
    const y = Math.log(Math.tan((Math.PI / 4) + (lat * (Math.PI / 180) / 2))) * earthRadius;
    return [x, y];
  };

  // Reset all data
  const resetMeasurement = (): void => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsRecording(false);
    setCoordinates([]);
    setArea(null);
    setCurrentPosition(null);
    setError(null);
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Land Area Measurement</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4 flex gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Stop Recording
          </button>
        )}
        
        <button
          onClick={resetMeasurement}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
      
      {isRecording && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          Recording in progress... Walk around the perimeter of your land.
          {currentPosition && (
            <p className="mt-2">
              Current position: {currentPosition[0].toFixed(6)}, {currentPosition[1].toFixed(6)}
            </p>
          )}
          <p className="mt-2">Points recorded: {coordinates.length}</p>
        </div>
      )}
      
      {area !== null && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <p className="font-bold">Measured Area:</p>
          <p>{area.toFixed(2)} square meters</p>
          <p>{(area / 10000).toFixed(4)} hectares</p>
          <p>{(area / 4046.86).toFixed(4)} acres</p>
        </div>
      )}
      
      {coordinates.length > 0 && currentPosition && (
        <div className="h-96 w-full mb-4 border border-gray-300 rounded">
          {typeof window !== 'undefined' && (
            <MapContainer 
              center={currentPosition} 
              zoom={18} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {coordinates.length > 2 && (
                <Polygon positions={coordinates} />
              )}
              {coordinates.map((coord, index) => (
                <Marker key={index} position={coord} />
              ))}
            </MapContainer>
          )}
        </div>
      )}
      
      {coordinates.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Recorded Coordinates</h2>
          <div className="max-h-40 overflow-y-auto bg-gray-100 p-2 rounded">
            {coordinates.map((coord, index) => (
              <div key={index} className="mb-1">
                Point {index + 1}: {coord[0].toFixed(6)}, {coord[1].toFixed(6)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}