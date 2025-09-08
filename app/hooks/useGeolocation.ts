import { useState, useEffect, useRef, useCallback } from 'react';
import { Position } from '../types/farm-measurement';
import { calculateDistance } from '../utils/farmMeasurementUtils';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  distanceFilter?: number;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const watchId = useRef<number | null>(null);

  const {
    enableHighAccuracy = true,
    maximumAge = 0,
    timeout = 10000,
    distanceFilter = 1
  } = options;

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setIsLoading(false);
      return;
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      const newPosition: Position = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp
      };

      // Apply distance filter
      if (position) {
        const distance = calculateDistance(
          position.latitude,
          position.longitude,
          newPosition.latitude,
          newPosition.longitude
        );
        if (distance < distanceFilter) {
          return;
        }
      }

      setPosition(newPosition);
      setError(null);
      setIsLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(err.message);
      setIsLoading(false);
    };

    watchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        maximumAge,
        timeout
      }
    );
  }, [enableHighAccuracy, maximumAge, timeout, distanceFilter, position]);

  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const getCurrentPosition = useCallback(() => {
    return new Promise<Position>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position: Position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp
          };
          resolve(position);
        },
        (err) => reject(new Error(err.message)),
        { enableHighAccuracy, maximumAge, timeout }
      );
    });
  }, [enableHighAccuracy, maximumAge, timeout]);

  useEffect(() => {
    startWatching();
    return () => stopWatching();
  }, [startWatching, stopWatching]);

  return {
    position,
    error,
    isLoading,
    startWatching,
    stopWatching,
    getCurrentPosition
  };
};