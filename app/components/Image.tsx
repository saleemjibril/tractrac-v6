// Global Image component that automatically optimizes Cloudinary URLs
import React from 'react';
import { Image as ChakraImage, ImageProps as ChakraImageProps } from '@chakra-ui/react';
import NextImage from 'next/image';
import { getOptimizedImageUrl } from '../utils/imageUtils';

// Next.js Image props
interface NextImageProps {
  layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  sizes?: string;
  unoptimized?: boolean;
}

interface GlobalImageProps extends Omit<ChakraImageProps, 'src' | 'objectFit'> {
  src: string;
  width?: number | string | { [key: string]: string | number };
  height?: number | string | { [key: string]: string | number };
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  transformations?: string; // Additional Cloudinary transformations
  disableOptimization?: boolean; // Option to disable optimization for specific images
  useNextImage?: boolean; // Toggle between Next.js and Chakra UI Image
  // Next.js specific props
  layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down' | string;
  objectPosition?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  sizes?: string;
  unoptimized?: boolean;
}

export default function Image({
  src,
  width,
  height,
  crop = 'limit',
  transformations,
  disableOptimization = false,
  useNextImage = false,
  // Next.js specific props
  layout,
  objectFit,
  objectPosition,
  priority = false,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL,
  quality = 75,
  sizes,
  unoptimized = false,
  ...props
}: GlobalImageProps) {
  if (!src) return null;

  // Get optimized URL with transformations
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

  // Use Next.js Image for better performance and layout support
  if (useNextImage || layout === 'fill') {
    return (
      <NextImage
        src={optimizedSrc}
        alt={props.alt || ''}
        width={layout === 'fill' ? undefined : getNumericValue(width)}
        height={layout === 'fill' ? undefined : getNumericValue(height)}
        layout={layout}
        objectFit={objectFit as 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'}
        objectPosition={objectPosition}
        priority={priority}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL || optimizedSrc}
        quality={quality}
        sizes={sizes}
        unoptimized={unoptimized}
        {...(layout === 'fill' ? { fill: true } : {})}
      />
    );
  }

  // Use Chakra UI Image for styling consistency
  return (
    <ChakraImage
      src={optimizedSrc}
      width={width}
      height={height}
      objectFit={objectFit as any}
      {...props}
    />
  );
}

// Export as named export for easier importing
export { Image as OptimizedImage };
