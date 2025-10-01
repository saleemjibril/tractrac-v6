"use client";
import { useState, useCallback } from 'react';
import { Position, FarmPath } from '../types/farm-measurement';
import { calculateDistance, calculatePerimeter, calculatePolygonArea } from '../utils/farmMeasurementUtils';
import { FarmMeasurementService } from '../services/farmMeasurementService';

export const useFarmMeasurement = () => {
  const [trackPoints, setTrackPoints] = useState<Position[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [savedPaths, setSavedPaths] = useState<FarmPath[]>([]);
  const [measurementService] = useState(() => new FarmMeasurementService());

  const startPath = useCallback((initialPosition: Position) => {
    setTrackPoints([initialPosition]);
    setIsTracking(true);
    setIsPaused(false);
  }, []);

  const addPoint = useCallback((position: Position) => {
    if (!isTracking || isPaused) return;

    setTrackPoints(prev => {
      // Check minimum distance threshold
      const lastPoint = prev[prev.length - 1];
      if (lastPoint) {
        const distance = calculateDistance(
          lastPoint.latitude,
          lastPoint.longitude,
          position.latitude,
          position.longitude
        );
        if (distance < 2) return prev; // Skip if too close
      }

      return [...prev, position];
    });
  }, [isTracking, isPaused]);

  const pauseTracking = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTracking = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setIsPaused(false);
  }, []);

  const savePath = useCallback(async () => {
    if (trackPoints.length < 3) {
      throw new Error('Not enough points to create a valid measurement');
    }

    // Close the polygon by adding first point at the end
    const coordinates: [number, number][] = [
      ...trackPoints.map(p => [p.longitude, p.latitude] as [number, number]),
      [trackPoints[0].longitude, trackPoints[0].latitude]
    ];

    const path: FarmPath = {
      id: Date.now().toString(),
      coordinates,
      timestamp: Date.now(),
      areaSquareMeters: calculatePolygonArea(coordinates),
      perimeterMeters: calculatePerimeter(coordinates)
    };

    // Save to localStorage for offline support
    const existingPaths = JSON.parse(localStorage.getItem('farmPaths') || '[]');
    const updatedPaths = [...existingPaths, path];
    localStorage.setItem('farmPaths', JSON.stringify(updatedPaths));

    setSavedPaths(updatedPaths);
    return path;
  }, [trackPoints]);

  const createMeasurementOnServer = useCallback(async (path: FarmPath, token: string) => {
    return measurementService.createMeasurement(path, token);
  }, [measurementService]);

  const loadLastSavedPath = useCallback(() => {
    const paths = JSON.parse(localStorage.getItem('farmPaths') || '[]');
    return paths.length > 0 ? paths[paths.length - 1] : null;
  }, []);

  const clearSavedPaths = useCallback(() => {
    localStorage.removeItem('farmPaths');
    setSavedPaths([]);
  }, []);

  const syncOfflineMeasurements = useCallback(async () => {
    try {
      await measurementService.syncOfflineMeasurements();
      // Reload saved paths after sync
      const paths = JSON.parse(localStorage.getItem('farmPaths') || '[]');
      setSavedPaths(paths);
      
      // Show success message if there were paths to sync
      if (paths.length === 0) {
        alert('All measurements have been synced successfully!');
      }
    } catch (error) {
      console.error('Failed to sync offline measurements:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync measurements. Please try again later.';
      alert(errorMessage);
    }
  }, [measurementService]);

  return {
    trackPoints,
    isTracking,
    isPaused,
    savedPaths,
    startPath,
    addPoint,
    pauseTracking,
    resumeTracking,
    stopTracking,
    savePath,
    createMeasurementOnServer,
    loadLastSavedPath,
    clearSavedPaths,
    syncOfflineMeasurements
  };
};


