"use client";

import Image from "next/image";
import React from "react";

const Preloader: React.FC = () => {
  return (
    <div className="preloader">
      <Image
        src="https://res.cloudinary.com/tractrac-global/image/upload/v1747644706/tractrac_logo_png_vfhoy7.png"
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
