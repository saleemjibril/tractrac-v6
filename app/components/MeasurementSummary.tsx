"use client";
// components/MeasurementSummary.tsx
import React, { useState } from 'react';
import { FarmPath, MeasurementUnit } from '../types/farm-measurement';

interface MeasurementSummaryProps {
  measurement: FarmPath;
  onClose: () => void;
  returnContext?: 'home' | 'tractor-booking';
  // Optional multi-measurement support
  progressCurrent?: number;
  progressTotal?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

const measurementUnits: MeasurementUnit[] = [
  { fullname: 'Square Metres (sq m)', unit: 'sq m' },
  // { fullname: 'Hectares (ha)', unit: 'ha' },
  // { fullname: 'Acres', unit: 'acres' },
  // { fullname: 'Plots', unit: 'plots' },
  // { fullname: 'Square Feet (sq ft)', unit: 'sq ft' },
  // { fullname: 'Square Yards (sq yd)', unit: 'sq yd' },
];

export const MeasurementSummary: React.FC<MeasurementSummaryProps> = ({
  measurement,
  onClose,
  returnContext = 'home',
  progressCurrent,
  progressTotal,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<MeasurementUnit>(measurementUnits[0]);
  const [showUnitSelector, setShowUnitSelector] = useState(false);

  const convertArea = (areaInSquareMeters: number, toUnit: string): number => {
    switch (toUnit) {
      case 'sq m': return areaInSquareMeters;
      case 'ha': return areaInSquareMeters / 10000;
      case 'acres': return areaInSquareMeters / 4046.86;
      case 'plots': return areaInSquareMeters / 648; // Assuming 648 sq m per plot
      case 'sq ft': return areaInSquareMeters * 10.764;
      case 'sq yd': return areaInSquareMeters * 1.196;
      default: return areaInSquareMeters;
    }
  };

  const convertedArea = convertArea(measurement.areaSquareMeters || 0, selectedUnit.unit);

  const handleCopyArea = async () => {
    try {
      await navigator.clipboard.writeText(convertedArea.toFixed(2));
      alert('Area copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Image */}
      <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(135deg, #FA9411, #e67e00)'}}>
        <div className="text-white text-center">
          <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <h2 className="text-xl font-bold">Measurement Complete</h2>
          {progressCurrent && progressTotal && (
            <p className="mt-1 text-sm opacity-90">Measurement {progressCurrent}/{progressTotal}</p>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-6">
          You can now copy area result or remeasure if anything looks off
        </p>

        <div className="mb-4">
          <label className="block text-gray-500 text-sm mb-2">
            Measured Area Size
          </label>
          
          <div
            onClick={() => setShowUnitSelector(true)}
            className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">
                {convertedArea.toFixed(2)}
              </span>
              <div className="flex items-center space-x-2 text-gray-500">
                <span>/{selectedUnit.unit}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCopyArea}
          className="w-full text-white py-3 px-4 rounded-lg font-semibold mb-4 flex items-center justify-center space-x-2"
          style={{backgroundColor: '#FA9411'}}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e00'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FA9411'}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
          </svg>
          <span>Copy</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={onSecondary || onClose}
            className="flex-1 border py-2 px-4 rounded-lg font-semibold"
            style={{borderColor: '#FA9411', color: '#FA9411'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FA941110'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {secondaryLabel || 'Redo'}
          </button>
          <button
            onClick={onPrimary || onClose}
            className="flex-1 text-white py-2 px-4 rounded-lg font-semibold"
            style={{backgroundColor: '#FA9411'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e00'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FA9411'}
          >
            {primaryLabel || (returnContext === 'tractor-booking' ? 'Continue Booking' : 'Back to Home')}
          </button>
        </div>
      </div>

      {/* Unit Selector Modal */}
      {showUnitSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-sm w-full m-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Select Unit of Measurement</h3>
              <div className="space-y-2">
                {measurementUnits.map((unit) => (
                  <button
                    key={unit.unit}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setShowUnitSelector(false);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-100 rounded-lg border-b border-gray-200 last:border-b-0"
                  >
                    {unit.fullname}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};