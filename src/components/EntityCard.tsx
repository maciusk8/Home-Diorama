import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiClose } from '@mdi/js';
import type { EntityState } from '../types/communication';

interface EntityCardProps {
    entityId: string;
    customName?: string;
    entityData?: EntityState;
    onClose: () => void;
    onRemove: () => void;
    onRename: (newName: string) => void;
}

export default function EntityCard({ entityId, customName, entityData, onClose, onRemove, onRename }: EntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;
    const [isEditing, setIsEditing] = useState(false);
    const [nameInput, setNameInput] = useState(displayName);

    const handleSaveName = () => {
        const trimmed = nameInput.trim();
        if (trimmed && trimmed !== displayName) {
            onRename(trimmed);
        }
        setIsEditing(false);
    };

    return (
        <div className="entity-card-overlay" onClick={onClose}>
            <div className="entity-card" onClick={e => e.stopPropagation()}>
                <div className="entity-card-header">
                    {isEditing ? (
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
                    ) : (
                        <h3 className="entity-card-name" onClick={() => setIsEditing(true)}>
                            {displayName}
                            <Icon path={mdiPencilOutline} size={0.6} className="entity-card-edit-icon" />
                        </h3>
                    )}
                    <button className="entity-card-close" onClick={onClose}>
                        <Icon path={mdiClose} size={0.8} />
                    </button>
                </div>

                <p className="entity-card-state">{entityData?.state ?? 'unknown'}</p>
                <p className="entity-card-id">{entityId}</p>
                <button className="entity-card-remove" onClick={onRemove}>Usuń encję</button>
            </div>
        </div>
    );
}
