import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiWeatherNight } from '@mdi/js';
import PopupOverlay from '@/shared/components/PopupOverlay';
import ImageUploader from '@/shared/components/ImageUploader';
import { Button } from 'react-bootstrap';
import '@/features/rooms/components/ImageAreaSelector.css';

interface NightViewSetterProps {
    onNightImageUpload: (newImage: string | null) => void;
}


export default function NightViewSetter({ onNightImageUpload }: NightViewSetterProps) {
    const [isOpen, setOpen] = useState(false);
    const [nightImage, setNightImage] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        onNightImageUpload(nightImage);
        setTimeout(() => setOpen(false), 500);
    };

    return (
        <>
            <button
                className="bottom-right-corner-widget"
                onClick={() => {
                    setOpen(true);
                    setIsSaved(false);
                }}
                title="Set the night view of your room"
            >
                <Icon path={mdiWeatherNight} size={1.2} />
            </button>

            {isOpen && (
                <PopupOverlay onClose={() => setOpen(false)}>
                    <div className="image-area-selector-container m-auto image-area-selector-container-inner" style={{ minWidth: '40vw' }} onClick={(e) => e.stopPropagation()}>
                        <h4 className="mb-3 text-center">Set the night view of your room</h4>
                        <div className="text-center mb-4">
                            <small>This image will be displayed if your sun entity is in the night state.</small>
                        </div>

                        <div style={{ width: '100%', height: '60vh', minHeight: '300px' }}>
                            <ImageUploader onImageUpload={setNightImage}>
                                {nightImage && (
                                    <img
                                        src={nightImage}
                                        alt="Night View"
                                        className="image-uploader-img"
                                    />
                                )}
                            </ImageUploader>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-4 w-100">
                            <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
                            <Button variant="danger" onClick={() => { setNightImage(null); }}>Delete</Button>
                            <Button variant={isSaved ? "success" : "primary"} onClick={handleSave}>
                                {isSaved ? "Saved!" : "Save"}
                            </Button>
                        </div>
                    </div>
                </PopupOverlay>
            )}
        </>
    );
}
