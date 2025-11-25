import secureLocalStorage from 'react-secure-storage';

export interface TractorMediaModel {
  url: string;
  fileName: string;
  fileSize: string;
  filePath?: string;
  mediaType: 'image' | 'video';
}

class TractorMediaUploadService {
  private readonly BASE_URL = 'https://tractracplus-backend-v6.onrender.com/api/v1';

  private getAuthToken(): string | null {
    const userToken = secureLocalStorage.getItem("xak") as string;
    const adminToken = secureLocalStorage.getItem("xuk") as string;
    return userToken || adminToken || null;
  }

  /**
   * Upload a single image using the new API endpoint
   * @param imageFile - The image file to upload
   * @param folder - Optional folder name (defaults to "images")
   * @returns The uploaded image URL or null if upload fails
   */
  async uploadSingleImage(imageFile: File, folder: string = 'images'): Promise<string | null> {
    try {
      if (!imageFile) return null;

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('folder', folder);

      const token = this.getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.BASE_URL}/uploads/images`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Image upload response:", responseData);
        
        // API returns the uploaded image URL as response
        const imageUrl = typeof responseData === 'string' ? responseData : responseData.url || responseData.data?.url;
        return imageUrl || null;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Image upload failed:', response.status, errorData);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  /**
   * Upload multiple images using the new API endpoint
   * @param imageFiles - Array of image files to upload
   * @param folder - Optional folder name (defaults to "images")
   * @returns Array of uploaded image models or null if upload fails
   */
  async uploadMultipleImages(imageFiles: File[], folder: string = 'images'): Promise<TractorMediaModel[] | null> {
    try {
      if (!imageFiles || imageFiles.length === 0) return null;

      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('folder', folder);

      const token = this.getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.BASE_URL}/uploads/images/multiple`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Multiple images upload response:", responseData);

        // API should return array of URLs
        const urls = Array.isArray(responseData) ? responseData : responseData.urls || responseData.data || [];
        
        const uploadedImages: TractorMediaModel[] = urls.map((url: string, index: number) => {
          const file = imageFiles[index];
          const sizeInKB = (file.size / 1024).toFixed(2);
          
          return {
            url: typeof url === 'string' ? url : url.url || url,
            fileName: file.name,
            fileSize: `${sizeInKB} KB`,
            mediaType: 'image' as const,
          };
        });

        return uploadedImages.length > 0 ? uploadedImages : null;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Multiple images upload failed:', response.status, errorData);
        return null;
      }
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      return null;
    }
  }

  /**
   * Upload a single video using the new API endpoint
   * @param videoFile - The video file to upload
   * @param folder - Optional folder name (defaults to "videos")
   * @returns The uploaded video model or null if upload fails
   */
  async uploadSingleVideo(videoFile: File, folder: string = 'videos'): Promise<TractorMediaModel | null> {
    try {
      if (!videoFile) return null;

      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('folder', folder);

      const token = this.getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.BASE_URL}/uploads/videos`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Video upload response:", responseData);

        const videoUrl = typeof responseData === 'string' ? responseData : responseData.url || responseData.data?.url;
        const sizeInMB = (videoFile.size / (1024 * 1024)).toFixed(2);

        if (videoUrl) {
          return {
            url: videoUrl,
            fileName: videoFile.name,
            fileSize: `${sizeInMB} MB`,
            mediaType: 'video',
          };
        }
        return null;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Video upload failed:', response.status, errorData);
        return null;
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  }

  /**
   * Legacy method for backward compatibility - uploads a single image
   * @deprecated Use uploadSingleImage instead
   */
  async uploadTractorMedia(mediaFile: File, resourceType?: string): Promise<string | null> {
    if (resourceType === 'video') {
      const result = await this.uploadSingleVideo(mediaFile);
      return result?.url || null;
    }
    return this.uploadSingleImage(mediaFile);
  }
}

// Export a singleton instance
export const tractorMediaUploadService = new TractorMediaUploadService();
