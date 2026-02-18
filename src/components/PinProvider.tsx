import type { EntityState } from '../types/communication';
import DraggablePin from './DnD/DragablePin';
import StaticPin from './StaticPin';

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

export default function PinProvider({
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
                <DraggablePin
                    entityId={id}
                    x={x}
                    y={y}
                    entityData={entityData}
                    customName={customName}
                    onRename={onRename}
                    onRemove={onRemove}
                />
            ) : (
                <StaticPin
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
