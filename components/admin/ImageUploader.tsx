'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Image from 'next/image';

interface UploadedImage {
    url: string;
    publicId: string;
}

interface ImageUploaderProps {
    onUpload: (images: UploadedImage[]) => void;
    maxImages?: number;
    existingImages?: UploadedImage[];
}

export default function ImageUploader({
    onUpload,
    maxImages = 5,
    existingImages = []
}: ImageUploaderProps) {
    const [images, setImages] = useState<UploadedImage[]>(existingImages);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setUploading(true);

        try {
            const uploadPromises = filesToUpload.map((file) =>
                uploadToCloudinary(file, (progress) => {
                    setUploadProgress(progress);
                })
            );

            const uploadedImages = await Promise.all(uploadPromises);
            const newImages = [...images, ...uploadedImages];
            setImages(newImages);
            onUpload(newImages);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [images, maxImages, onUpload]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    }, [handleUpload]);

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onUpload(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-gray-300 hover:border-gold-400'
                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files)}
                    className="hidden"
                    disabled={uploading || images.length >= maxImages}
                />

                <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
                        ) : (
                            <Upload className="w-8 h-8 text-gray-400" />
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {uploading ? `Uploading... ${uploadProgress}%` : 'Drop images here or click to upload'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB ({images.length}/{maxImages} uploaded)
                        </p>
                    </div>
                </label>
            </div>

            {/* Uploaded Images */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                                <Image
                                    src={image.url}
                                    alt={`Upload ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 bg-gold-500 text-white text-xs px-2 py-1 rounded">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
