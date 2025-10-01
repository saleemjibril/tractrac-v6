"use client";
import React from 'react';

interface GPSQualityAlertProps {
  accuracy: number;
  onContinue: () => void;
  onWait: () => void;
}

export const GPSQualityAlert: React.FC<GPSQualityAlertProps> = ({
  accuracy,
  onContinue,
  onWait
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4" style={{color: '#FA9411'}}>Poor GPS Signal</h3>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-700">
            Your current GPS accuracy is {accuracy.toFixed(1)} meters, which may affect measurement accuracy.
          </p>
          
          <div>
            <p className="font-semibold text-gray-800 mb-2">Tips to improve GPS signal:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Move to an open area away from tall buildings</li>
              <li>Make sure your device has a clear view of the sky</li>
              <li>Wait a few minutes for your GPS to stabilize</li>
              <li>Check if your device case is blocking the signal</li>
              <li>Ensure your location settings are set to high accuracy</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onWait}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-semibold"
          >
            Wait for Better Signal
          </button>
          <button
            onClick={onContinue}
            className="flex-1 text-white py-2 px-4 rounded-lg font-semibold"
            style={{backgroundColor: '#FA9411'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e00'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FA9411'}
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};