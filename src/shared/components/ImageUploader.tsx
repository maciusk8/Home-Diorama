import { type ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploader.css';

interface ImageUploaderProps {
    onImageUpload: (newImage: string) => void;
    className?: string;
    children?: ReactNode;
}

export default function ImageUploader({
    onImageUpload,
    className = '',
    children
}: ImageUploaderProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onImageUpload(URL.createObjectURL(acceptedFiles[0]));
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
