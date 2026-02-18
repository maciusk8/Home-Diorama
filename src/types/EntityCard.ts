import type { EntityState } from './communication';

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

// Re-exporting EntityCardProviderProps if needed by consumer, checks if it was exported before.
// Actually EntityCardProviderProps was defined in the provider file.
// Let's check what was in provider.
