"use client";

import Image from 'next/image';
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <Image
                      src="https://res.cloudinary.com/tractrac-global/image/upload/v1746446664/logo_ofzooy.svg"

       alt="logo-image" 
        width={250}
        height={250}
        className="preloader__image"
        />
        <div className="spinner"></div>
      
    </div>
  );
};

export default Preloader;