/**
 * Supabase Storage Integration for Shop BD
 * 
 * Responsibilities:
 * - High-speed bucket storage for PRODUCT_IMAGES, CATEGORY_IMAGES, BANNER_IMAGES, 
 *   BRAND_IMAGES, PROFILE_IMAGES, REVIEW_IMAGES, OTHER_WEBSITE_MEDIA
 * - Configured Buckets: 'products', 'categories', 'banners', 'brands', 'profiles', 'reviews', 'other-media'
 * - RLS & Storage policy configuration reference
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || "[SUPABASE_PROJECT_URL]",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "[SUPABASE_ANON_KEY]",
  storageBucket: import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "[SUPABASE_STORAGE_BUCKET]"
};

export const SUPABASE_BUCKETS = [
  'products',
  'categories',
  'banners',
  'brands',
  'profiles',
  'reviews',
  'other-media'
] as const;

export type SupabaseBucket = typeof SUPABASE_BUCKETS[number];

let supabase: SupabaseClient | null = null;
const isConfigured = 
  supabaseConfig.url !== "[SUPABASE_PROJECT_URL]" && 
  supabaseConfig.anonKey !== "[SUPABASE_ANON_KEY]" &&
  supabaseConfig.url.startsWith('https://');

if (isConfigured) {
  try {
    supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);
  } catch (err) {
    console.warn('Supabase client init fallback:', err);
  }
}

export { supabase };

/**
 * Upload an image file to Supabase Storage with bucket separation
 */
export async function uploadToSupabaseStorage(
  file: File, 
  bucket: SupabaseBucket = 'products',
  customPath?: string
): Promise<{ url: string; error?: string }> {
  if (!supabase || !isConfigured) {
    // Return a reliable local object URL or Data URL for preview testing when using placeholders
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          url: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 9)}_${Date.now()}.${fileExt}`;
    const filePath = customPath ? `${customPath}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicData.publicUrl };
  } catch (err: any) {
    console.error('Supabase upload error:', err);
    return { url: '', error: err.message || 'Failed to upload image' };
  }
}
