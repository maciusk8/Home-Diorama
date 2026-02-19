import type { EntityState } from '../../types/communication';
import EntityDefaultCard from './EntityDefaultCard';
import EntitySwitchCard from './EntitySwitchCard';

interface EntityCardProviderProps {
    entityId: string;
    domain: string;
    customName?: string;
    entityData?: EntityState;
    onClose: () => void;
}


import EntityLightCard from './EntityLightCard';

export default function EntityCardRenderer(props: EntityCardProviderProps) {
    const { entityId, domain, ...baseProps } = props;

    switch (domain) {
        case 'switch':
            return <EntitySwitchCard entityId={entityId} {...baseProps} />;
        case 'light':
            return <EntityLightCard entityId={entityId} {...baseProps} />;
        default:
            return <EntityDefaultCard entityId={entityId} {...baseProps} />;
    }
}