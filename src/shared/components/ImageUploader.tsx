import { type ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploader.css';

interface ImageUploaderProps {
    onImageUpload: (newImage: string) => void;
    className?: string;
    children?: ReactNode;
}

async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/local/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.url; // e.g. "/uploads/abc123.png"
}

export default function ImageUploader({
    onImageUpload,
    className = '',
    children
}: ImageUploaderProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const url = await uploadFile(acceptedFiles[0]);
                onImageUpload(url);
            }
        }
    });

    return (
        <div {...getRootProps()} className={`image-uploader-container image-uploader-editing ${className}`}>
            <input {...getInputProps()} />
            {children ? children : (
                <div className={`image-uploader-placeholder ${isDragActive ? 'image-uploader-drag-active' : ''}`}>
                    <p className="image-uploader-text">
                        {isDragActive ? "Drop here to upload..." : "Click or drag an image"}
                    </p>
                </div>
            )}
        </div>
    );
}
