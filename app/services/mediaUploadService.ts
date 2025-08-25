export interface TractorMediaModel {
  url: string;
  fileName: string;
  fileSize: string;
  filePath?: string;
  mediaType: 'image' | 'video';
}

class TractorMediaUploadService {
  private readonly CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/tractrac-global/upload';
  private readonly UPLOAD_PRESET = 'dswdebju';

  async uploadTractorMedia(mediaFile: File, resourceType?: string): Promise<string | null> {
    try {
      if (!mediaFile) return null;

      const mimeType = mediaFile.type;
      let uploadResourceType = resourceType || 'auto';

      if (mimeType?.startsWith('video/')) {
        uploadResourceType = 'video';
      } else if (mimeType?.startsWith('image/')) {
        uploadResourceType = 'image';
      }

      const formData = new FormData();
      formData.append('upload_preset', this.UPLOAD_PRESET);
      formData.append('resource_type', uploadResourceType);
      formData.append('file', mediaFile);

      const response = await fetch(this.CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Cloudinary Response:", responseData);

        const secureUrl = responseData.secure_url as string;
        if (secureUrl && uploadResourceType === 'image') {
          const optimizedUrl = secureUrl.replace('/upload/', '/upload/c_auto,f_auto,q_auto:good/');
          console.log("Tractor Media", optimizedUrl);
          return optimizedUrl;
        }
        return secureUrl;
      } else {
        console.log('Upload failed with status code:', response.status);
        return null;
      }
    } catch (error) {
      console.log('Error uploading to Cloudinary:', error);
      return null;
    }
  }

  async uploadMultipleImages(imageFiles: File[]): Promise<TractorMediaModel[] | null> {
    try {
      const uploadedImages: TractorMediaModel[] = [];

      for (const imageFile of imageFiles) {
        const uploadedUrl = await this.uploadTractorMedia(imageFile, 'image');

        if (uploadedUrl) {
          const sizeInKB = (imageFile.size / 1024).toFixed(2);

          uploadedImages.push({
            url: uploadedUrl,
            fileName: imageFile.name,
            fileSize: `${sizeInKB} KB`,
            mediaType: 'image',
          });
        }
      }

      console.log("Tractor Media", uploadedImages);
      return uploadedImages.length > 0 ? uploadedImages : null;
    } catch (error) {
      console.log('Error uploading multiple images:', error);
      return null;
    }
  }

  async uploadSingleVideo(videoFile: File): Promise<TractorMediaModel | null> {
    try {
      const uploadedUrl = await this.uploadTractorMedia(videoFile, 'video');

      if (uploadedUrl) {
        const sizeInMB = (videoFile.size / (1024 * 1024)).toFixed(2);

        return {
          url: uploadedUrl,
          fileName: videoFile.name,
          fileSize: `${sizeInMB} MB`,
          mediaType: 'video',
        };
      }
      return null;
    } catch (error) {
      console.log('Error uploading video:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const tractorMediaUploadService = new TractorMediaUploadService();
