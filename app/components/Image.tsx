// Global Image component that automatically optimizes Cloudinary URLs
import React from 'react';
import { Image as ChakraImage, ImageProps } from '@chakra-ui/react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface GlobalImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  width?: number | string | { [key: string]: string | number };
  height?: number | string | { [key: string]: string | number };
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  transformations?: string; // Additional Cloudinary transformations
  disableOptimization?: boolean; // Option to disable optimization for specific images
}

export default function Image({
  src,
  width,
  height,
  crop = 'limit',
  transformations,
  disableOptimization = false,
  ...props
}: GlobalImageProps) {
  if (!src) return null;

  // Get optimized URL with transformations
  // For responsive values, we'll use the base value or default to desktop width
  const getNumericValue = (value: number | string | { [key: string]: string | number } | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? undefined : num;
    }
    if (typeof value === 'object' && value !== null) {
      // For responsive objects, use base value or default
      return value.base ? parseFloat(String(value.base)) : undefined;
    }
    return undefined;
  };

  const optimizedSrc = disableOptimization 
    ? src 
    : getOptimizedImageUrl(src, {
        width: getNumericValue(width),
        height: getNumericValue(height),
        crop,
        transformations
      });

  return (
    <ChakraImage
      src={optimizedSrc}
      width={width}
      height={height}
      {...props}
    />
  );
}

// Export as named export for easier importing
export { Image as OptimizedImage };
