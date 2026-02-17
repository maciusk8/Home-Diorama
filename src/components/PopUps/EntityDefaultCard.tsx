import AbstractEntityCard from './AbstractEntityCard';
import { type EntityCardProps } from './EntityCardProvider';

export default function EntityDefaultCard({ entityId, customName, entityData, onClose, onRemove, onRename }: EntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;

    return (
        <AbstractEntityCard onClose={onClose}>
            <AbstractEntityCard.Header name={displayName} onClose={onClose} />
            <AbstractEntityCard.State value={entityData?.state ?? 'unknown'} />
            <AbstractEntityCard.Id value={entityId} />
        </AbstractEntityCard>
    );
}
