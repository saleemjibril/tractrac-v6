"use client";
import React, { useState, useEffect } from 'react';

interface OfflineIndicatorProps {
  onSync?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onSync }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [hasUnsyncedData, setHasUnsyncedData] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check for unsynced data
    const checkUnsyncedData = () => {
      const offlinePaths = JSON.parse(localStorage.getItem('farmPaths') || '[]');
      setHasUnsyncedData(offlinePaths.length > 0);
    };

    checkUnsyncedData();
    
    // Check periodically
    const interval = setInterval(checkUnsyncedData, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  if (!hasUnsyncedData && isOnline) return null;

  return (
    <div className="border rounded-lg p-4 mb-4" style={{backgroundColor: '#FA941110', borderColor: '#FA941150'}}>
      <div className="flex items-center space-x-3">
        <div style={{color: '#FA9411'}}>
          {!isOnline ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold" style={{color: '#d97706'}}>
            {/* {!isOnline ? 'You are offline' : 'You have unsynced farm measurements'} */}
            {!isOnline && 'You are offline'}
          </p>
          {/* <p className="text-sm" style={{color: '#FA9411'}}>
            {!isOnline 
              ? 'Measurements will be saved locally and synced when connection is restored'
              : 'Your recent measurements need to be synced to the server'
            }
          </p> */}
        </div>
        {/* {isOnline && hasUnsyncedData && onSync && (
          <button
            onClick={onSync}
            className="text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{backgroundColor: '#FA9411'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e67e00'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FA9411'}
          >
            Sync Now
          </button>
        )} */}
      </div>
    </div>
  );
};