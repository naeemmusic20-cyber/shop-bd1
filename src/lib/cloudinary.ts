/**
 * Cloudinary Image Optimization & CDN Transformation Utility for Shop BD
 * 
 * Responsibilities:
 * - Image Optimization (f_auto, q_auto)
 * - Compression and Resizing (w_*, h_*, c_fill / c_limit)
 * - Modern Next-Gen Format Delivery (WebP, AVIF)
 * - Responsive Srcset Generation
 * - Thumbnail Generation
 * - CDN Delivery
 * 
 * NOTE: [CLOUDINARY_API_SECRET] is strictly server-side and never exposed here.
 */

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "[CLOUDINARY_CLOUD_NAME]",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "[CLOUDINARY_UPLOAD_PRESET]"
};

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'thumb';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  gravity?: 'center' | 'face' | 'auto';
  blur?: number;
}

/**
 * Optimizes an image URL via Cloudinary URL-based transforms if it's a Cloudinary asset,
 * or attaches CDN optimization parameters if supported.
 */
export function getOptimizedImageUrl(
  originalUrl: string, 
  options: ImageTransformOptions = {}
): string {
  if (!originalUrl) return '';

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    blur
  } = options;

  // If using an actual Cloudinary image URL
  if (originalUrl.includes('res.cloudinary.com')) {
    const parts = originalUrl.split('/upload/');
    if (parts.length === 2) {
      const transformArray: string[] = [
        `f_${format}`,
        `q_${quality}`
      ];
      if (width) transformArray.push(`w_${width}`);
      if (height) transformArray.push(`h_${height}`);
      if (crop) transformArray.push(`c_${crop}`);
      if (gravity && crop === 'fill') transformArray.push(`g_${gravity}`);
      if (blur) transformArray.push(`e_blur:${blur}`);

      return `${parts[0]}/upload/${transformArray.join(',')}/${parts[1]}`;
    }
  }

  // If using Unsplash CDN images (popular fallback placeholders), support high-perf dynamic optimization params
  if (originalUrl.includes('images.unsplash.com')) {
    const urlObj = new URL(originalUrl);
    if (width) urlObj.searchParams.set('w', width.toString());
    if (height) urlObj.searchParams.set('h', height.toString());
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('q', '80');
    return urlObj.toString();
  }

  return originalUrl;
}

/**
 * Generate a fast thumbnail URL
 */
export function getThumbnailUrl(imageUrl: string, size = 150): string {
  return getOptimizedImageUrl(imageUrl, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
}

/**
 * Generate responsive srcset for picture/img tags
 */
export function getResponsiveSrcSet(imageUrl: string, widths: number[] = [320, 640, 960, 1280]): string {
  return widths
    .map(w => `${getOptimizedImageUrl(imageUrl, { width: w, quality: 'auto' })} ${w}w`)
    .join(', ');
}

/**
 * Direct unsigned upload to Cloudinary using upload preset
 */
export async function uploadToCloudinary(file: File): Promise<{ url: string; error?: string }> {
  if (
    cloudinaryConfig.cloudName === "[CLOUDINARY_CLOUD_NAME]" || 
    cloudinaryConfig.uploadPreset === "[CLOUDINARY_UPLOAD_PRESET]"
  ) {
    // Graceful fallback to FileReader DataURL for demo
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
    return { url: data.secure_url };
  } catch (err: any) {
    return { url: '', error: err.message || 'Cloudinary upload error' };
  }
}
