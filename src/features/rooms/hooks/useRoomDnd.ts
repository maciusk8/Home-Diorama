import { useState } from 'react';
import { type DragEndEvent, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { calcDropPercent } from '@/shared/utils/geometry';
import type { DbPin, DbRoom } from '../../../../server/db/types';

interface UseRoomDndOptions {
    currentRoom: DbRoom;
    pins: DbPin[];
    entityTypeId?: string;
    mapRef: React.RefObject<HTMLDivElement | null>;
    updatePin: (pins: DbPin[], pinId: string, patch: Partial<DbPin>) => void;
    addPin: (pin: DbPin) => void;
}

export default function useRoomDnd({ currentRoom, pins, entityTypeId, mapRef, updatePin, addPin }: UseRoomDndOptions) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over?.id === currentRoom.id && mapRef.current) {
            const dropPosition = calcDropPercent(active, mapRef.current);

            if (dropPosition) {
                const isPin = active.data.current?.type === 'pin';

                if (isPin) {
                    updatePin(pins, active.data.current?.entityId, dropPosition);
                } else {
                    const entityId = active.id as string;
                    const alreadyOnMap = pins.some(p => p.id === entityId);

                    if (!alreadyOnMap) {
                        if (!entityTypeId) {
                            console.error('Cannot add pin: entityTypeId is missing');
                            return;
                        }

                        addPin({
                            id: entityId,
                            roomId: currentRoom.id,
                            typeId: entityTypeId,
                            x: dropPosition.x,
                            y: dropPosition.y,
                        });
                    }
                }
            }
        }

        setActiveId(null);
    }

    return { sensors, activeId, handleDragStart, handleDragEnd };
}
