import AbstractEntityCard from './AbstractEntityCard';
import { type BaseEntityCardProps } from '../../types/EntityCard';
import useSwitches from '../../hooks/Entities/useSwitches';
import { Button } from 'react-bootstrap';

export default function EntitySwitchCard({ entityId, customName, entityData, onClose }: BaseEntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;
    const { toggle } = useSwitches();

    return (
        <AbstractEntityCard onClose={onClose}>
            <AbstractEntityCard.Header name={displayName} onClose={onClose} />
            <AbstractEntityCard.Body>
                <Button onClick={() => toggle(entityId)}>Toggle Switch</Button>
            </AbstractEntityCard.Body>
            <AbstractEntityCard.State value={entityData?.state ?? 'unknown'} />
            <AbstractEntityCard.Id value={entityId} />
        </AbstractEntityCard>
    );
}
