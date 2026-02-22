import ImageUploader from '@/shared/components/ImageUploader';
import './ImageDisplay.css';

interface ImageDisplayProps {
    image: string | null;
    changeImage: (newImage: string) => void;
    isEditing: boolean;
}

export default function ImageDisplay({ image, changeImage, isEditing }: ImageDisplayProps) {
    if (!isEditing && !image) {
        return (
            <div className="image-display-container">
                <div className="image-display-placeholder">
                    <p className="image-display-text">No image</p>
                </div>
            </div>
        );
    }

    if (!isEditing && image) {
        return (
            <div className="image-display-container">
                <img
                    src={image}
                    alt="Room"
                    className="image-display-img"
                />
            </div>
        );
    }

    return (
        <ImageUploader
            onImageUpload={changeImage}
            className="image-display-uploader"
        >
            {image && (
                <img
                    src={image}
                    alt="Room"
                    className="image-uploader-img"
                />
            )}
        </ImageUploader>
    );
}