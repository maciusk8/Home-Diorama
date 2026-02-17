import type { EntityState } from '../../types/communication';
import EntityEditCard from './EntityEditCard';
import EntityDefaultCard from './EntityDefaultCard';
import EntitySwitchCard from './EntitySwitchCard';

interface EntityCardProviderProps {
    entityId: string;
    customName?: string;
    entityData?: EntityState;
    isEditing: boolean;
    onClose: () => void;
    onRemove: () => void;
    onRename: (newName: string) => void;
}


export default function EntityCardProvider(props: EntityCardProviderProps) {
    if (props.isEditing) {
        return <EntityEditCard {...props} />;
    }

    const { onRemove, onRename, isEditing, ...baseProps } = props;
    const domain = props.entityId.split('.')[0];

    switch (domain) {
        case 'switch':
            return <EntitySwitchCard {...baseProps} />;
        default:
            return <EntityDefaultCard {...baseProps} />;
    }
}