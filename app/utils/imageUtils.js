// utils/imageUtils.js
export function getOptimizedImageUrl(url, options = {}) {
  if (!url) return url;
  
  // Cloudinary transformations are disabled
  // Return original URL without any transformations
  return url;
  
  // // Check if it's a Cloudinary URL
  // if (url.includes('cloudinary.com')) {
  //   // Split the URL at '/upload/'
  //   const [baseUrl, imageParams] = url.split('/upload/');
  //   
  //   // Build optimization parameters
  //   let optimizations = [];
  //   
  //   // Default optimizations
  //   optimizations.push('f_auto'); // Auto format (WebP/AVIF when supported)
  //   optimizations.push('q_auto'); // Auto quality
  //   
  //   // Add width constraint if specified
  //   if (options.width) {
  //     optimizations.push(`w_${options.width}`);
  //   }
  //   
  //   // Add height constraint if specified
  //   if (options.height) {
  //     optimizations.push(`h_${options.height}`);
  //   }
  //   
  //   // Add crop mode if specified
  //   if (options.crop) {
  //     optimizations.push(`c_${options.crop}`);
  //   } else if (options.width || options.height) {
  //     optimizations.push('c_limit'); // Default crop mode when dimensions specified
  //   }
  //   
  //   // Add any additional transformations
  //   if (options.transformations) {
  //     optimizations.push(options.transformations);
  //   }
  //   
  //   return `${baseUrl}/upload/${optimizations.join(',')}/${imageParams}`;
  // }
  // 
  // return url;
}

// Helper function for responsive images
// Cloudinary transformations are disabled - returns original URLs
export function getResponsiveImageUrl(url, breakpoints = {}) {
  if (!url) return url;
  
  // Return original URL for all breakpoints (transformations disabled)
  return {
    mobile: url,
    tablet: url,
    desktop: url
  };
  
  // // Original implementation (commented out - transformations disabled)
  // const { mobile = 400, tablet = 800, desktop = 1200 } = breakpoints;
  // 
  // return {
  //   mobile: getOptimizedImageUrl(url, { width: mobile, crop: 'limit' }),
  //   tablet: getOptimizedImageUrl(url, { width: tablet, crop: 'limit' }),
  //   desktop: getOptimizedImageUrl(url, { width: desktop, crop: 'limit' })
  // };
}