import { put } from '@vercel/blob';

export interface UploadResult {
  url: string;
  error?: string;
}

/**
 * Upload an image file to Vercel blob storage
 * Uses client-side upload in development, server-side in production
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: '', error: 'Please select a valid image file' };
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      return { url: '', error: 'Image size must be less than 2MB' };
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `profile-pictures/${timestamp}-${randomSuffix}.${fileExtension}`;

    // Always use client-side upload for now (will work in both dev and prod)
    console.log('Using client-side upload, hostname:', window.location.hostname);
    console.log('CSP meta tag:', document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content'));
    
    // Use client-side upload
    const blobToken = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return { 
        url: '', 
        error: 'Image upload is not configured. Please contact support.' 
      };
    }

    const blob = await put(fileName, file, {
      access: 'public',
      token: blobToken,
    });

    return { url: blob.url };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      url: '', 
      error: error instanceof Error ? error.message : 'Failed to upload image' 
    };
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file (JPG, PNG, GIF)' };
  }

  // Check file size (2MB limit)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image size must be less than 2MB' };
  }

  // Check allowed formats
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please use JPG, PNG, GIF, or WebP format' };
  }

  return { isValid: true };
}

/**
 * Create a preview URL for the selected file
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Cleanup preview URL to prevent memory leaks
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}
