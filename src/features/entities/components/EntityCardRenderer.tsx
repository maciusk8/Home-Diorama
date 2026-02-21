import type { EntityState } from '@/shared/types/communication';
import EntityDefaultCard from '@/features/entities/components/EntityDefaultCard';
import EntitySwitchCard from '@/features/entities/components/EntitySwitchCard';

interface EntityCardProviderProps {
    entityId: string;
    domain: string;
    customName?: string;
    entityData?: EntityState;
    onClose: () => void;
}


import EntityLightCard from '@/features/lights/components/EntityLightCard';

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