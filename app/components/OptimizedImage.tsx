import React from 'react';
import { Image as ChakraImage, ImageProps } from '@chakra-ui/react';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  width?: number | string;
  height?: number | string;
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  transformations?: string; // Additional Cloudinary transformations
  disableOptimization?: boolean; // Option to disable optimization for specific images
}

export default function OptimizedImage({
  src,
  width,
  height,
  crop = 'limit',
  transformations,
  disableOptimization = false,
  ...props
}: OptimizedImageProps) {
  if (!src) return null;

  // Get optimized URL with transformations
  const optimizedSrc = disableOptimization 
    ? src 
    : getOptimizedImageUrl(src, {
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
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
