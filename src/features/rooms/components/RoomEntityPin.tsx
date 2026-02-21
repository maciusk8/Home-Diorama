import type { EntityState } from '@/shared/types/communication';
import DraggableEntityPin from '@/features/dnd/components/DraggableEntityPin';
import StaticEntityPin from '@/features/entities/components/StaticEntityPin';

interface PinProviderProps {
    id: string;
    x: number;
    y: number;
    isEditing: boolean;
    entityData?: EntityState;
    customName?: string;
    onRename?: (name: string) => void;
    onRemove?: () => void;
}

export default function RoomEntityPin({
    id,
    x,
    y,
    isEditing,
    entityData,
    customName,
    onRename,
    onRemove
}: PinProviderProps) {
    return (
        <>
            {isEditing ? (
                <DraggableEntityPin
                    entityId={id}
                    x={x}
                    y={y}
                    entityData={entityData}
                    customName={customName}
                    onRename={onRename}
                    onRemove={onRemove}
                />
            ) : (
                <StaticEntityPin
                    entityId={id}
                    x={x}
                    y={y}
                    entityData={entityData}
                    customName={customName}
                />
            )}
        </>
    );
}
