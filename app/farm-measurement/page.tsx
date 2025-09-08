"use client";
import React, { useState } from 'react';
import { FarmMeasurementMap } from '../components/FarmMeasurementMap';
import { MeasurementSummary } from '../components/MeasurementSummary';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { useFarmMeasurement } from '../hooks/useFarmMeasurement';
import { FarmPath } from '../types/farm-measurement';

export default function FarmMeasurementPage() {
  const [measurementResult, setMeasurementResult] = useState<FarmPath | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const { syncOfflineMeasurements } = useFarmMeasurement();

  const handleMeasurementComplete = (result: FarmPath) => {
    setMeasurementResult(result);
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    setMeasurementResult(null);
  };

  if (showSummary && measurementResult) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <MeasurementSummary
            measurement={measurementResult}
            onClose={handleCloseSummary}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <h1 className="text-2xl font-bold">Farm Measurement</h1>
              <p className="text-green-100 mt-2">
                Measure your farm size accurately using GPS mapping
              </p>
            </div>

            {/* Instructions */}
            <div className="p-6 border-b">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    How to measure your farm
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Walk around the edges of the farm and let the map automatically calculate the total area.
                    Make sure to have a clear GPS signal for accurate measurements.
                  </p>
                </div>
              </div>
            </div>

            {/* Offline Indicator */}
            <div className="px-6">
              <OfflineIndicator onSync={syncOfflineMeasurements} />
            </div>

            {/* Map Component */}
            <div className="p-6">
              <FarmMeasurementMap onMeasurementComplete={handleMeasurementComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}