import type { EntityCardProps } from '@/features/entities/entityRegistry';
import { useEntityRegistry } from '@/features/entities/entityRegistry';

export default function EntityCardRenderer(props: EntityCardProps) {
    const { getRegistryEntry } = useEntityRegistry();
    const domain = props.entityId.split('.')[0];
    const { CardComponent } = getRegistryEntry(domain);

    return <CardComponent {...props} />;
}