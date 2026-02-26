import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencilOutline } from '@mdi/js';
import AbstractEntityCard from '@/features/entities/components/AbstractEntityCard';
import { type EntityEditCardProps } from '@/shared/types/EntityCard';
import useCurrentRoom from '@/shared/hooks/useCurrentRoom';
import ImageAreaSelector from '@/features/rooms/components/ImageAreaSelector';
import LightEditor from '@/features/lights/components/LightEditor/LightEditor';
import './EntityCard.css';

export default function EntityEditCard({ entityId, customName, entityData, onClose, onRemove, onRename }: EntityEditCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;
    const [isEditing, setIsEditing] = useState(false);
    const [nameInput, setNameInput] = useState(displayName);
    const [isOpen, setIsOpen] = useState(false);
    const [isLightOpen, setIsLightOpen] = useState(false);
    const isLight = entityId.startsWith('light.');
    const { room: currentRoom } = useCurrentRoom();

    const handleSaveName = () => {
        const trimmed = nameInput.trim();
        if (trimmed && trimmed !== displayName) onRename(trimmed);
        setIsEditing(false);
    };

    return (
        <>
            <AbstractEntityCard onClose={onClose}>
                {isEditing ? (
                    <div className="entity-card-header">
                        <div className="entity-card-name-edit">
                            <input
                                className="entity-card-name-input"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                                autoFocus
                            />
                            <button className="entity-card-name-save" onClick={handleSaveName}>✓</button>
                        </div>
                    </div>
                ) : (
                    <div className="entity-card-header">
                        <h3 className="entity-card-name" onClick={() => setIsEditing(true)}>
                            {displayName}
                            <Icon path={mdiPencilOutline} size={0.6} className="entity-card-edit-icon" />
                        </h3>
                    </div>
                )}

                <AbstractEntityCard.Body>
                    <AbstractEntityCard.State value={entityData?.state ?? 'unknown'} />
                </AbstractEntityCard.Body>

                <button className="entity-card-area-btn" onClick={() => { setIsOpen(true) }}>Set click area</button>
                {isLight && (
                    <button
                        className="entity-card-area-btn entity-card-light-overlay-btn"
                        onClick={() => { setIsLightOpen(true) }}
                    >
                        Design Light Overlay
                    </button>
                )}

                <button className="entity-card-remove-btn" onClick={onRemove}>Delete Entity</button>

                <div className="entity-card-id-display">{entityId}</div>
            </AbstractEntityCard>

            {isOpen && currentRoom?.image != null && (
                <ImageAreaSelector imageSrc={currentRoom.image} entityId={entityId} onClose={() => setIsOpen(false)} />
            )}
            {isLightOpen && currentRoom?.image != null && (
                <LightEditor imageSrc={currentRoom.image} entityId={entityId} entityData={entityData} onClose={() => setIsLightOpen(false)} />
            )}
        </>
    );
}
