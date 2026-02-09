// Cloudinary configuration and utilities for image uploads

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfig = {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
};

/**
 * Upload image to Cloudinary using unsigned upload
 */
export async function uploadToCloudinary(
    file: File,
    onProgress?: (progress: number) => void
): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || '');
    formData.append('folder', 'dressco');

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        if (onProgress) {
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    onProgress(progress);
                }
            });
        }

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve({
                    url: response.secure_url,
                    publicId: response.public_id,
                });
            } else {
                reject(new Error('Upload failed'));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
        xhr.send(formData);
    });
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    // Note: Deletion requires authentication, so this should be done via server-side API
    const response = await fetch('/api/admin/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete image');
    }
}

/**
 * Get optimized image URL from Cloudinary
 */
export function getOptimizedImageUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
): string {
    const { width, height, quality = 80, format = 'auto' } = options;

    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transformString = transformations.join(',');

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}
