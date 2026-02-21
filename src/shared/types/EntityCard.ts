import type { EntityState } from '@/shared/types/communication';

export interface BaseEntityCardProps {
    entityId: string;
    customName?: string;
    entityData?: EntityState;
    onClose: () => void;
}

export interface EntityEditCardProps extends BaseEntityCardProps {
    onRemove: () => void;
    onRename: (newName: string) => void;
}


