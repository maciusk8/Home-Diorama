import { useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploader.css';

interface ImageUploaderProps {
    image: string | null;
    onImageUpload: (newImage: string) => void;
    className?: string;
    children?: ReactNode;
    placeholderText?: {
        clickOrDrag?: string;
        dropHere?: string;
    };
}

const defaultMessages = {
    clickOrDrag: "Click or drag an image",
    dropHere: "Drop here to upload..."
};

export default function ImageUploader({
    image,
    onImageUpload,
    className = '',
    children,
    placeholderText
}: ImageUploaderProps) {
    const messages = { ...defaultMessages, ...placeholderText };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const objectUrl = URL.createObjectURL(file);
            onImageUpload(objectUrl);
        }
    }, [onImageUpload]);

    useEffect(() => {
        return () => {
            if (image && image.startsWith('blob:')) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });

    return (
        <div
            {...getRootProps()}
            className={`image-uploader-container image-uploader-editing ${className}`}
        >
            <input {...getInputProps()} />

            {image && children ? (
                children
            ) : (
                <div className={`image-uploader-placeholder ${isDragActive ? 'image-uploader-drag-active' : ''}`}>
                    <p className="image-uploader-text">
                        {isDragActive ? messages.dropHere : messages.clickOrDrag}
                    </p>
                </div>
            )}
        </div>
    );
}
