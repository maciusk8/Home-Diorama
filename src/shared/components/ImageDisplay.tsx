import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageDisplay.css';

interface ImageDisplayProps {
    image: string | null;
    changeImage: (newImage: string) => void;
    isEditing: boolean;
}

const messages = {
    noImage: "No image",
    clickOrDrag: "Click or drag an image",
    dropHere: "Drop here to upload..."
};

export default function ImageDisplay({ image, changeImage, isEditing }: ImageDisplayProps) {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const objectUrl = URL.createObjectURL(file);
            changeImage(objectUrl);
        }
    }, [changeImage]);

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
        multiple: false,
        noClick: !isEditing,
        noDrag: !isEditing,
        noDragEventsBubbling: !isEditing,
    });

    return (
        <div
            {...getRootProps()}
            className={`image-display-container ${isEditing ? 'image-display-editing' : ''}`}
        >
            {isEditing && <input {...getInputProps()} />}

            {image ? (
                <img
                    src={image}
                    alt="Room"
                    className="image-display-img"
                />
            ) : (
                <div className={`image-display-placeholder ${isDragActive ? 'image-display-drag-active' : ''}`}>
                    <p className="image-display-text">
                        {isEditing
                            ? (isDragActive ? messages.dropHere : messages.clickOrDrag)
                            : messages.noImage}
                    </p>
                </div>
            )}
        </div>
    );
}