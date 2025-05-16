"use client";
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function FarmMeasurementMap() {
  // Map and position state
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [trackPoints, setTrackPoints] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLocationStable, setIsLocationStable] = useState(false);
  const watchId = useRef(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);

  // Constants
  const MIN_ACCURACY_THRESHOLD = 15.0;
  const REQUIRED_ACCURATE_FIXES = 3;
  const MIN_DISTANCE_BETWEEN_POINTS = 2.0;
  
  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return;
    
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [0, 0],
      zoom: 18
    });
    
    map.current.on('load', () => {
      initializeMap();
      requestLocationPermission();
    });

    return () => map.current?.remove();
  }, []);

  // Initialize map sources and layers
  const initializeMap = () => {
    if (!map.current) return;
    
    // Add path source and layer
    map.current.addSource('path-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    
    map.current.addLayer({
      id: 'path-layer',
      type: 'line',
      source: 'path-source',
      layout: {},
      paint: {
        'line-color': '#3498db',
        'line-width': 4,
        'line-dasharray': [2, 2]
      }
    });
    
    // Add current position point source and layer
    map.current.addSource('point-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    
    map.current.addLayer({
      id: 'point-layer',
      type: 'circle',
      source: 'point-source',
      paint: {
        'circle-radius': 8,
        'circle-color': '#3498db'
      }
    });
    
    // Add accuracy circle source and layer
    map.current.addSource('accuracy-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    
    map.current.addLayer({
      id: 'accuracy-layer',
      type: 'fill',
      source: 'accuracy-source',
      paint: {
        'fill-color': ['get', 'fill-color'],
        'fill-opacity': 0.2
      }
    }, 'point-layer');
  };

  // Request location permission and initialize location tracking
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentPosition({ latitude, longitude, accuracy });
        setGpsAccuracy(accuracy);
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 18
          });
        }
        
        initializeLocationStream();
      },
      (error) => {
        console.log('Error getting current position:', error);
        alert(`Error getting location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Initialize continuous location tracking
  const initializeLocationStream = () => {
    let accurateFixesCount = 0;
    
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsAccuracy(accuracy);
        
        // Check for location stability
        if (accuracy <= MIN_ACCURACY_THRESHOLD) {
          accurateFixesCount++;
          if (accurateFixesCount >= REQUIRED_ACCURATE_FIXES) {
            setIsLocationStable(true);
          }
        } else {
          accurateFixesCount = 0;
          setIsLocationStable(false);
          
          if (isTracking && accuracy > 20) {
            // Could implement GPS quality alert here
          }
        }
        
        const updatedPosition = { latitude, longitude, accuracy };
        
        // Check if position changed significantly
        if (isRealPositionChange(currentPosition, updatedPosition) || !currentPosition) {
          setCurrentPosition(updatedPosition);
          
          if (isTracking && !isPaused) {
            addTrackPoint(updatedPosition);
          }
          
          updateCurrentPosition(updatedPosition);
        }
      },
      (error) => {
        console.log('Location watch error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Check if position changed significantly
  const isRealPositionChange = (oldPos, newPos) => {
    if (!oldPos || !newPos) return true;
    
    const distance = calculateDistance(
      oldPos.latitude, oldPos.longitude,
      newPos.latitude, newPos.longitude
    );
    
    const threshold = isTracking ? MIN_DISTANCE_BETWEEN_POINTS : MIN_DISTANCE_BETWEEN_POINTS * 2;
    return distance >= threshold;
  };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Update current position marker on map
  const updateCurrentPosition = (position) => {
    if (!map.current || !position) return;
    
    // Update point marker
    const pointFeatureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [position.longitude, position.latitude]
        }
      }]
    };
    
    map.current.getSource('point-source').setData(pointFeatureCollection);
    
    // Update accuracy circle
    if (position.accuracy > 0) {
      const accuracyCircle = createAccuracyCircle(
        position.latitude, 
        position.longitude, 
        position.accuracy
      );
      map.current.getSource('accuracy-source').setData(accuracyCircle);
    }
    
    if (isTracking || isLocationStable) {
      map.current.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 18
      });
    }
  };

  // Create accuracy circle GeoJSON
  const createAccuracyCircle = (lat, lng, radiusInMeters) => {
    const points = 64;
    const coordinates = [];
    
    for (let i = 0; i <= points; i++) {
      const angle = (i * 2 * Math.PI / points);
      const dx = radiusInMeters * Math.cos(angle);
      const dy = radiusInMeters * Math.sin(angle);
      
      const earthRadius = 6378137;
      const dLat = dy / earthRadius;
      const dLng = dx / (earthRadius * Math.cos(Math.PI * lat / 180));
      
      const newLat = lat + dLat * 180 / Math.PI;
      const newLng = lng + dLng * 180 / Math.PI;
      
      coordinates.push([newLng, newLat]);
    }
    
    let fillColor;
    if (radiusInMeters <= 5) {
      fillColor = "#4CAF50"; // Green
    } else if (radiusInMeters <= 10) {
      fillColor = "#FFEB3B"; // Yellow
    } else if (radiusInMeters <= 20) {
      fillColor = "#FF9800"; // Orange
    } else {
      fillColor = "#F44336"; // Red
    }
    
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        },
        properties: {
          'fill-color': fillColor
        }
      }]
    };
  };

  // Start tracking
  const startTracking = () => {
    if (!currentPosition) return;
    
    if (currentPosition.accuracy > 20) {
      showGpsQualityWarningBeforeStart();
      return;
    }
    
    setTrackPoints([]);
    setIsTracking(true);
    setIsPaused(false);
    
    if (currentPosition) {
      const newTrackPoints = [currentPosition];
      setTrackPoints(newTrackPoints);
      updateMap(newTrackPoints);
    }
  };

  // Show GPS quality warning
  const showGpsQualityWarningBeforeStart = () => {
    const proceed = window.confirm(
      `Your current GPS accuracy is ${currentPosition.accuracy.toFixed(1)} meters.\n\n` +
      'Starting measurement with poor GPS signal may result in inaccurate measurements.\n\n' +
      'Tips to improve GPS signal:\n' +
      '• Move to an open area away from tall buildings\n' +
      '• Make sure your device has a clear view of the sky\n' +
      '• Wait a few minutes for your GPS to stabilize\n\n' +
      'Do you want to start anyway?'
    );
    
    if (proceed) {
      setTrackPoints([]);
      setIsTracking(true);
      setIsPaused(false);
      
      if (currentPosition) {
        const newTrackPoints = [currentPosition];
        setTrackPoints(newTrackPoints);
        updateMap(newTrackPoints);
      }
    }
  };

  // Pause tracking
  const pauseTracking = () => {
    setIsPaused(true);
  };

  // Resume tracking
  const resumeTracking = () => {
    setIsPaused(false);
    
    if (currentPosition && trackPoints.length > 0) {
      const lastPoint = trackPoints[trackPoints.length - 1];
      if (isRealPositionChange(lastPoint, currentPosition)) {
        addTrackPoint(currentPosition);
      }
    }
  };

  // Add track point
  const addTrackPoint = (position) => {
    if (trackPoints.length === 0 || 
        isRealPositionChange(trackPoints[trackPoints.length - 1], position)) {
      const newTrackPoints = [...trackPoints, position];
      setTrackPoints(newTrackPoints);
      updateMap(newTrackPoints);
    }
  };

  // Stop tracking and finalize measurement
  const stopTracking = async () => {
    if (currentPosition && isTracking) {
      let finalTrackPoints = [...trackPoints];
      
      if (trackPoints.length > 0) {
        const lastPoint = trackPoints[trackPoints.length - 1];
        if (isRealPositionChange(lastPoint, currentPosition)) {
          finalTrackPoints = [...finalTrackPoints, currentPosition];
        }
      }
      
      if (finalTrackPoints.length < 3) {
        alert('Not enough points. You need to walk around more of your farm boundary to get an accurate measurement.');
        return;
      }
      
      // Close the polygon by adding the first point again
      if (finalTrackPoints.length > 1) {
        finalTrackPoints = [...finalTrackPoints, finalTrackPoints[0]];
      }
      
      setTrackPoints(finalTrackPoints);
      updateMap(finalTrackPoints);
      
      try {
        // Save measurement to server
        await saveMeasurement(finalTrackPoints);
        
        setIsTracking(false);
        setIsPaused(false);
        
        // Navigate to results page or show results
        alert('Measurement completed successfully!');
        // router.push('/measurement-summary');
      } catch (error) {
        console.log('Error saving measurement:', error);
        alert('Failed to save measurement. Your measurement was saved locally.');
      }
    }
  };

  // Save measurement to server
  const saveMeasurement = async (points) => {
    // Transform points to the format expected by your API
    const formattedPoints = points.map(point => ({
      longitude: point.longitude,
      latitude: point.latitude
    }));
    
    try {
      const response = await fetch('/api/farm-measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: formattedPoints }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.log('Error saving measurement:', error);
      // Save locally for later sync
      localStorage.setItem('pendingMeasurement', JSON.stringify(formattedPoints));
      throw error;
    }
  };

  // Update map with current track points
  const updateMap = (points) => {
    if (!map.current || points.length === 0) return;
    
    const lineCoordinates = points.map(point => [point.longitude, point.latitude]);
    
    const featureCollection = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: lineCoordinates
        }
      }]
    };
    
    map.current.getSource('path-source').setData(featureCollection);
    updateCurrentPosition(currentPosition);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Get GPS quality indicator
  const getGpsQualityIndicator = () => {
    if (!currentPosition) {
      return {
        color: 'gray',
        text: 'Waiting for GPS...'
      };
    }
    
    const accuracy = currentPosition.accuracy;
    
    if (accuracy <= 5) {
      return {
        color: 'green',
        text: `GPS: Excellent (${accuracy.toFixed(1)}m)`
      };
    } else if (accuracy <= 10) {
      return {
        color: 'yellow',
        text: `GPS: Good (${accuracy.toFixed(1)}m)`
      };
    } else if (accuracy <= 20) {
      return {
        color: 'orange',
        text: `GPS: Fair (${accuracy.toFixed(1)}m)`
      };
    } else {
      return {
        color: 'red',
        text: `GPS: Poor (${accuracy.toFixed(1)}m)`
      };
    }
  };

  const gpsQuality = getGpsQualityIndicator();

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Farm Measurement</h1>
      </header>
      
      <main className="flex-grow relative">
        {/* Map Container */}
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* GPS Quality Indicator */}
        <div 
          className="absolute bottom-4 left-4 p-2 rounded-md text-white font-semibold" 
          style={{ backgroundColor: gpsQuality.color + 'CC' }}
        >
          {gpsQuality.text}
        </div>
        
        {/* Instruction Banner */}
        {!isTracking && (
          <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-80 p-4 rounded-md shadow-md border border-blue-300">
            <div className="flex items-center">
              <div className="mr-3 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p>Tap "Start Measuring" and walk along your farm border.</p>
            </div>
          </div>
        )}
        
        {/* Location Stability Notice */}
        {!isLocationStable && !isTracking && (
          <div className="absolute top-20 left-0 right-0 flex justify-center">
            <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
              Waiting for stable GPS signal...
            </div>
          </div>
        )}
      </main>
      
      {/* Control Panel */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between">
          {!isTracking ? (
            <button
              onClick={startTracking}
              disabled={!currentPosition}
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold disabled:bg-gray-300"
            >
              Start Measuring
            </button>
          ) : (
            <>
              <button
                onClick={isPaused ? resumeTracking : pauseTracking}
                className="w-[48%] border-2 border-blue-500 text-blue-500 py-3 rounded-md font-semibold"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stopTracking}
                className="w-[48%] bg-blue-500 text-white py-3 rounded-md font-semibold"
              >
                Finish
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}