// components/OptimizedImage.js
import Image from 'next/image';
import { getOptimizedImageUrl } from './imageUtils'; // Adjust the import path as necessary

export default function OptimizedImage({ src, alt, ...props }) {
  const optimizedUrl = getOptimizedImageUrl(src);
  
  return (
    src && 
    <Image
      src={optimizedUrl}
      alt={alt || ""}
      {...props}
      quality={props.quality || 75}
      placeholder="blur" // Optional: adds blur-up effect
      blurDataURL={optimizedUrl} // Optional: for blur-up effect
      priority={false} // Set to true for above-the-fold images
      loading="lazy"  // Default behavior, but good to be explicit
    />
  );
}