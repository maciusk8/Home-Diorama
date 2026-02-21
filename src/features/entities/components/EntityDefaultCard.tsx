import AbstractEntityCard from '@/features/entities/components/AbstractEntityCard';
import { type BaseEntityCardProps } from '@/shared/types/EntityCard';

export default function EntityDefaultCard({ entityId, customName, entityData, onClose }: BaseEntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;

    return (
        <AbstractEntityCard onClose={onClose}>
            <AbstractEntityCard.Header name={displayName} />
            <AbstractEntityCard.Body>
                <AbstractEntityCard.State value={entityData?.state ?? 'unknown'} />
            </AbstractEntityCard.Body>
            <AbstractEntityCard.Id value={entityId} />
        </AbstractEntityCard>
    );
}
