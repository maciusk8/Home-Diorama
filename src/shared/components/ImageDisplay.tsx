import ImageUploader from '@/shared/components/ImageUploader';
import './ImageDisplay.css';
import type { Room } from '@/features/rooms/types/rooms';
import type { EntityState } from '@/shared/types/communication';
import { useEffect, useState } from 'react';

interface ImageDisplayProps {
    room: Room;
    changeImage: (newImage: string) => void;
    isEditing: boolean;
    sunEntity: EntityState | undefined;
}

export default function ImageDisplay({ room, changeImage, isEditing, sunEntity }: ImageDisplayProps) {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const isNight = sunEntity?.state === 'below_horizon';
        const displayImage = (isNight && room.nightImage) ? room.nightImage : room.image;
        setImage(displayImage);
    }, [sunEntity, room]);

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