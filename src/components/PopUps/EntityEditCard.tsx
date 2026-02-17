import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencilOutline } from '@mdi/js';
import AbstractEntityCard from './AbstractEntityCard';
import { type EntityCardProps } from './EntityCardProvider';

export default function EntityEditCard({ entityId, customName, entityData, onClose, onRemove, onRename }: EntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;
    const [isEditing, setIsEditing] = useState(false);
    const [nameInput, setNameInput] = useState(displayName);

    const handleSaveName = () => {
        const trimmed = nameInput.trim();
        if (trimmed && trimmed !== displayName) onRename(trimmed);
        setIsEditing(false);
    };

    return (
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

            <AbstractEntityCard.State value={entityData?.state ?? 'unknown'} />
            <button className="entity-card-remove" onClick={onRemove}>Usuń encję</button>
            <AbstractEntityCard.Id value={entityId} />
        </AbstractEntityCard>
    );
}
