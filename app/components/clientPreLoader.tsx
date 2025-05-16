"use client";

import React, { useState, useEffect } from 'react';
import Preloader from './preLoader';

interface ClientPreloaderProps {
  children: React.ReactNode;
}

const ClientPreloader: React.FC<ClientPreloaderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 50);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      setTimeout(() => setIsLoading(false), 2500);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <>
      {isLoading && <Preloader />}
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
};

export default ClientPreloader;