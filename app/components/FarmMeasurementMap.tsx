import React, { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useFarmMeasurement } from '../hooks/useFarmMeasurement';
import { Position } from '../types/farm-measurement';
import { GPSQualityAlert } from './GPSQualityAlert';
import loader from '../googleMapsLoader';

interface FarmMeasurementMapProps {
  onMeasurementComplete?: (result: any) => void;
}

export const FarmMeasurementMap: React.FC<FarmMeasurementMapProps> = ({
  onMeasurementComplete
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [path, setPath] = useState<google.maps.Polyline | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [accuracyCircle, setAccuracyCircle] = useState<google.maps.Circle | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showGPSAlert, setShowGPSAlert] = useState(false);

  const { position, error, isLoading } = useGeolocation({
    enableHighAccuracy: true,
    distanceFilter: 1
  });

  const {
    trackPoints,
    isTracking,
    isPaused,
    startPath,
    addPoint,
    pauseTracking,
    resumeTracking,
    stopTracking,
    savePath
  } = useFarmMeasurement();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const initializeMap = async () => {
      try {
        await loader.importLibrary("maps");
        
        const initialMap = new google.maps.Map(mapRef.current!, {
          zoom: 18,
          center: { lat: 6.5244, lng: 3.3792 }, // Default to Lagos
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          disableDefaultUI: true,
          zoomControl: true,
        });

        setMap(initialMap);
        setIsMapLoaded(true);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();
  }, [map]);

  // Update map center when position changes
  useEffect(() => {
    if (!map || !position) return;

    const center = { lat: position.latitude, lng: position.longitude };
    
    if (isTracking) {
      map.setCenter(center);
    }

    // Update current position marker
    if (marker) {
      marker.setPosition(center);
    } else {
      const newMarker = new google.maps.Marker({
        position: center,
        map,
        title: 'Current Position',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#FA9411',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });
      setMarker(newMarker);
    }

    // Update accuracy circle
    if (accuracyCircle) {
      accuracyCircle.setCenter(center);
      accuracyCircle.setRadius(position.accuracy);
    } else {
      const circle = new google.maps.Circle({
        center,
        radius: position.accuracy,
        map,
        fillColor: getAccuracyColor(position.accuracy),
        fillOpacity: 0.2,
        strokeColor: getAccuracyColor(position.accuracy),
        strokeOpacity: 0.5,
        strokeWeight: 1,
      });
      setAccuracyCircle(circle);
    }
  }, [map, position, marker, accuracyCircle, isTracking]);

  // Add point to tracking when position changes
  useEffect(() => {
    if (position && isTracking) {
      addPoint(position);
    }
  }, [position, isTracking, addPoint]);

  // Update path visualization
  useEffect(() => {
    if (!map || trackPoints.length === 0) return;

    const pathCoordinates = trackPoints.map(point => ({
      lat: point.latitude,
      lng: point.longitude
    }));

    if (path) {
      path.setPath(pathCoordinates);
    } else {
      const newPath = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FA9411',
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });
      newPath.setMap(map);
      setPath(newPath);
    }
  }, [map, trackPoints, path]);

  const handleStartMeasurement = () => {
    if (!position) {
      alert('Waiting for GPS location. Please wait a moment and try again.');
      return;
    }

    if (position.accuracy > 20) {
      setShowGPSAlert(true);
      return;
    }

    startPath(position);
  };

  const handleGPSAlertContinue = () => {
    setShowGPSAlert(false);
    if (position) {
      startPath(position);
    }
  };

  const handleGPSAlertWait = () => {
    setShowGPSAlert(false);
  };

  const handleFinishMeasurement = async () => {
    if (trackPoints.length < 3) {
      alert('You need to walk around more of your farm boundary to get an accurate measurement. Please continue mapping.');
      return;
    }

    try {
      stopTracking();
      const savedPath = await savePath();
      onMeasurementComplete?.(savedPath);
    } catch (error) {
      console.error('Error saving measurement:', error);
      alert('Error saving measurement. Please try again.');
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 5) return '#4CAF50';
    if (accuracy <= 10) return '#FFEB3B'; 
    if (accuracy <= 20) return '#FF9800';
    return '#F44336';
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 5) return `GPS: Excellent (${accuracy.toFixed(1)}m)`;
    if (accuracy <= 10) return `GPS: Good (${accuracy.toFixed(1)}m)`;
    if (accuracy <= 20) return `GPS: Fair (${accuracy.toFixed(1)}m)`;
    return `GPS: Poor (${accuracy.toFixed(1)}m)`;
  };

  const getAccuracyStyle = (accuracy: number) => {
    if (accuracy <= 5) return 'bg-green-600 bg-opacity-80';
    if (accuracy <= 10) return 'bg-yellow-600 bg-opacity-80';
    if (accuracy <= 20) return 'bg-orange-600 bg-opacity-80';
    return 'bg-red-600 bg-opacity-80';
  };

  if (isLoading && isMapLoaded) {
    return (
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!isMapLoaded ? 'Loading map...' : 'Getting GPS location...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-96 bg-red-50 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold mb-2">GPS Error</p>
          <p className="text-red-500 text-sm">{error}</p>
          <p className="text-gray-600 text-xs mt-2">Please enable location services and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* GPS Quality Alert */}
      {showGPSAlert && position && (
        <GPSQualityAlert
          accuracy={position.accuracy}
          onContinue={handleGPSAlertContinue}
          onWait={handleGPSAlertWait}
        />
      )}
      
      {/* GPS Accuracy Indicator */}
      {position && (
        <div className={`absolute bottom-4 left-4 text-white px-3 py-2 rounded-lg text-sm font-medium ${getAccuracyStyle(position.accuracy)}`}>
          {getAccuracyText(position.accuracy)}
        </div>
      )}

      {/* Tracking Status Indicator */}
      {isTracking && (
        <div className="absolute top-4 left-4 bg-red-600 bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm font-medium">
          {isPaused ? '⏸️ Paused' : '🔴 Recording'}
          <div className="text-xs mt-1">
            Points: {trackPoints.length}
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      {!isTracking && (
        <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Ready to measure</h3>
            <p className="text-sm text-gray-600">
              Tap "Start Measuring" and walk along your farm border. The blue dot shows your current location.
            </p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-3">
        {!isTracking ? (
          <button
            onClick={handleStartMeasurement}
            disabled={!position}
            className="disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
            style={{backgroundColor: !position ? '#9ca3af' : '#FA9411'}}
            onMouseEnter={(e) => position && (e.currentTarget.style.backgroundColor = '#e67e00')}
            onMouseLeave={(e) => position && (e.currentTarget.style.backgroundColor = '#FA9411')}
          >
            Start Measuring
          </button>
        ) : (
          <>
            <button
              onClick={isPaused ? resumeTracking : pauseTracking}
              className="bg-white hover:bg-gray-50 px-4 py-3 rounded-lg font-semibold shadow-lg transition-colors border-2"
              style={{color: '#FA9411', borderColor: '#FA9411'}}
              title={isPaused ? 'Resume tracking' : 'Pause tracking'}
            >
              {isPaused ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={handleFinishMeasurement}
              className="text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
              style={{backgroundColor: '#FA9411'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FA9411'}
            >
              Finish
            </button>
          </>
        )}
      </div>
    </div>
  );
};