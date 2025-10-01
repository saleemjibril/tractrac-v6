"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Position } from '../types/farm-measurement';
import { calculateDistance } from '../utils/farmMeasurementUtils';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  distanceFilter?: number;
  minAccuracyThreshold?: number; // meters
  requiredAccurateFixes?: number; // number of good fixes before emitting
  smoothingWindowSize?: number; // moving average window
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const watchId = useRef<number | null>(null);
  const recentPositionsRef = useRef<Position[]>([]);
  const accurateFixesRef = useRef<number>(0);

  const {
    enableHighAccuracy = true,
    maximumAge = 0,
    timeout = 10000,
    distanceFilter = 1,
    minAccuracyThreshold = 15,
    requiredAccurateFixes = 3,
    smoothingWindowSize = 3
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

      // Accuracy gating: require sufficiently accurate fixes
      if (newPosition.accuracy > minAccuracyThreshold) {
        accurateFixesRef.current = 0;
        // Ignore poor accuracy updates to reduce jitter
        return;
      }

      // Count consecutive accurate fixes to ensure stability
      accurateFixesRef.current = Math.min(
        requiredAccurateFixes,
        accurateFixesRef.current + 1
      );
      if (accurateFixesRef.current < requiredAccurateFixes) {
        return;
      }

      // Maintain smoothing buffer
      recentPositionsRef.current.push(newPosition);
      if (recentPositionsRef.current.length > smoothingWindowSize) {
        recentPositionsRef.current.shift();
      }

      // Compute simple moving average for smoothing
      const smoothed = recentPositionsRef.current.reduce(
        (acc, p) => ({
          latitude: acc.latitude + p.latitude,
          longitude: acc.longitude + p.longitude,
          accuracy: acc.accuracy + p.accuracy,
          timestamp: Math.max(acc.timestamp, p.timestamp),
        }),
        { latitude: 0, longitude: 0, accuracy: 0, timestamp: 0 } as Position
      );
      const count = recentPositionsRef.current.length || 1;
      const smoothedPosition: Position = {
        latitude: smoothed.latitude / count,
        longitude: smoothed.longitude / count,
        accuracy: smoothed.accuracy / count,
        timestamp: smoothed.timestamp,
      };

      // Apply distance filter against last emitted position
      if (position) {
        const distance = calculateDistance(
          position.latitude,
          position.longitude,
          smoothedPosition.latitude,
          smoothedPosition.longitude
        );
        if (distance < distanceFilter) {
          return;
        }
      }

      setPosition(smoothedPosition);
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
  }, [enableHighAccuracy, maximumAge, timeout, distanceFilter, position, minAccuracyThreshold, requiredAccurateFixes, smoothingWindowSize]);

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