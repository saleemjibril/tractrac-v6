// utils/imageUtils.js
export function getOptimizedImageUrl(url) {
    // Check if it's a Cloudinary URL
    if (url?.includes('cloudinary.com')) {
      // Split the URL at '/upload/'
      const [baseUrl, imageParams] = url.split('/upload/');
      // Combine with optimization parameters
      return `${baseUrl}/upload/f_auto,q_auto/${imageParams}`;
    }
    return url;
  }