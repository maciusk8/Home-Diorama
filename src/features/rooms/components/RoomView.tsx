import { useEffect, useMemo, useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { EntityState } from '@/shared/types/communication';

import ImageDisplay from '@/shared/components/ImageDisplay';
import EntityDropdown from '@/features/entities/components/EntityDropdown';
import { useEntities } from '@/features/entities/hooks/useEntities';
import { DroppableMap } from '@/features/dnd/components/DroppableMap';
import RoomEntityPin from '@/features/rooms/components/RoomEntityPin';
import RoomToolbar from '@/features/rooms/components/RoomToolbar';
import { getLightStyle } from '@/features/lights/utils/lightUtils';
import useCurrentRoom from '@/shared/hooks/useCurrentRoom';
import useRoomMutations from '@/features/rooms/hooks/useRoomMutations';
import useRoomDnd from '@/features/rooms/hooks/useRoomDnd';
import type { LightConfig } from '@/features/rooms/types/rooms';
import './RoomView.css';


export default function RoomView({ isEditing }: { isEditing: boolean }) {

    const entitiesFromHook = useEntities();
    const { room: currentRoom, pins, lights, lightTypeMap, pinTypeMap, isLoading } = useCurrentRoom();
    const mutations = useRoomMutations();

    const mapRef = useRef<HTMLDivElement>(null);

    const entityMap = useMemo(() => {
        const map = new Map<string, EntityState>();
        for (const e of entitiesFromHook) map.set(e.entity_id, e);
        return map;
    }, [entitiesFromHook]);

    const lightConfigMap = useMemo(() => {
        const map = new Map<string, LightConfig[]>();
        for (const light of lights) {
            const typeName = lightTypeMap.byId.get(light.typeId) ?? 'Point Light';
            const config: LightConfig = {
                type: (typeName === 'Point Light' ? 'point' : 'directional') as 'point' | 'directional',
                maxBrightness: light.maxBrightness,
                radius: light.radius,
                angle: light.angle,
                spread: light.spread,
                position: { x: light.x, y: light.y },
            };
            const existing = map.get(light.pinId) ?? [];
            existing.push(config);
            map.set(light.pinId, existing);
        }
        return map;
    }, [lights, lightTypeMap]);

    const entityTypeId = pinTypeMap?.byName.get('entity');

    const dnd = useRoomDnd({
        currentRoom: currentRoom!,
        pins,
        entityTypeId,
        mapRef,
        updatePin: mutations.updatePin,
        addPin: mutations.addPin,
    });

    useEffect(() => {
        document.body.style.backgroundColor = currentRoom?.bgColor || '';
        return () => { document.body.style.backgroundColor = ''; };
    }, [currentRoom?.bgColor]);

    if (isLoading) return <div>Loading...</div>;
    if (!currentRoom) return <div style={{ color: 'red' }}>Room not found</div>;

    return (
        <div className='roomView'>
            <DndContext sensors={dnd.sensors} onDragEnd={dnd.handleDragEnd} onDragStart={dnd.handleDragStart}>
                {isEditing && (
                    <div className="entity-sidebar">
                        <EntityDropdown entities={entitiesFromHook} />
                    </div>
                )}
                <DroppableMap id={currentRoom.id} ref={mapRef}>
                    <ImageDisplay room={currentRoom}
                        changeImage={(img: string | null) => mutations.updateRoom(currentRoom, { image: img })}
                        isEditing={isEditing}
                        sunEntity={entityMap.get('sun.sun')} />

                    {pins.map(pin => {
                        const configs = lightConfigMap.get(pin.id);
                        if (!configs) return null;
                        const entityData = entityMap.get(pin.id);
                        return configs.map((config, idx) => (
                            <div key={`light-${pin.id}-${idx}`} style={getLightStyle(config, entityData, false)} />
                        ));
                    })}

                    {pins.map(pin => (
                        <RoomEntityPin
                            key={pin.id}
                            id={pin.id}
                            x={pin.x}
                            y={pin.y}
                            isEditing={isEditing}
                            entityData={entityMap.get(pin.id)}
                            customName={pin.customName ?? undefined}
                            onRename={(name: string) => mutations.updatePin(pins, pin.id, { customName: name })}
                            onRemove={() => mutations.removePin(pin.id)}
                        />
                    ))}
                </DroppableMap>
                <DragOverlay dropAnimation={null}>
                    {dnd.activeId ? <div className="drag-pin" /> : null}
                </DragOverlay>
            </DndContext>

            {isEditing && <RoomToolbar room={currentRoom} updateRoom={mutations.updateRoom} />}
        </div>
    );
}
