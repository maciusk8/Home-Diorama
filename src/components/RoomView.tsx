import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Room, Entity } from '../types/rooms';

import ImageDisplay from './ImageDisplay';
import EntityDropdown from './EntityDropdown';
import WheelPalette from './PopUps/WheelPalette';
import { useEntities } from '../hooks/Entities/useEntities';
import { DroppableMap } from './DnD/DopableMap';
import RoomEntityPin from './RoomEntityPin';
import { useRooms } from '../hooks/useRooms';
import { calcDropPercent } from '../utils/geometry';


export default function RoomView({ isEditing }: { isEditing: boolean }) {
    
    const { roomName } = useParams();
    const entitiesFromHook = useEntities();
    const {rooms, setRooms, currentRoom, setCurrentRoom } = useRooms();
    const [activeId, setActiveId] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
    );
    
   useEffect(() => {
        const foundRoom = rooms.find(room => room.name === roomName);
        
        setCurrentRoom(foundRoom || null);
        
    }, [roomName, rooms, setCurrentRoom]); 

    useEffect(() => {
        document.body.style.backgroundColor = currentRoom?.bgColor || '';
        return () => { document.body.style.backgroundColor = ''; };
    }, [currentRoom?.bgColor]);

    if (!currentRoom) {
        return <div style={{ color: 'red' }}>Room not found: {roomName}</div>;
    }

    //Room update helpers

    const updateCurrentRoom = (patch: Partial<Room>) => {
        const updated = { ...currentRoom, ...patch };
        setRooms(rooms.map(r => r.name === currentRoom.name ? updated : r));
    };

    const updateEntity = (entityId: string, patch: Partial<Entity>) => {
        updateCurrentRoom({
            entities: currentRoom.entities.map(e =>
                e.id === entityId ? { ...e, ...patch } : e
            )
        });
    };

    const removeEntity = (entityId: string) => {
        updateCurrentRoom({
            entities: currentRoom.entities.filter(e => e.id !== entityId)
        });
    };

    // Drag handlers

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        if (!currentRoom) return;
        const { active, over } = event;

        if (over?.id === currentRoom.name && mapRef.current) {
            const dropPosition = calcDropPercent(active, mapRef.current);

            if (dropPosition) {
                const isPin = active.data.current?.type === 'pin';

                if (isPin) {
                    updateEntity(active.data.current?.entityId, dropPosition);
                } else {
                    const entityId = active.id as string;
                    const alreadyOnMap = currentRoom.entities.some(e => e.id === entityId);

                    if (!alreadyOnMap) {
                        updateCurrentRoom({
                            entities: [...currentRoom.entities, { id: entityId, ...dropPosition }]
                        });
                    }
                }
            }
        }

        setActiveId(null);
    }

    //Render

    return (
        <div className='roomView'>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                {isEditing && (
                    <div className="entity-sidebar">
                        <EntityDropdown entities={entitiesFromHook} />
                    </div>
                )}
                <DroppableMap id={currentRoom.name} ref={mapRef}>
                    <ImageDisplay image={currentRoom.image} changeImage={img => updateCurrentRoom({ image: img })} isEditing={isEditing} />
                    {currentRoom.entities.map(entity => (
                        <RoomEntityPin
                            key={entity.id}
                            id={entity.id}
                            x={entity.x}
                            y={entity.y}
                            isEditing={isEditing}
                            entityData={entitiesFromHook.find(e => e.entity_id === entity.id)}
                            customName={entity.customName}
                            onRename={(name) => updateEntity(entity.id, { customName: name })}
                            onRemove={() => removeEntity(entity.id)}
                        />
                    ))}
                </DroppableMap>
                <DragOverlay dropAnimation={null}>
                    {activeId ? <div className="drag-pin" /> : null}
                </DragOverlay>
            </DndContext>

            {isEditing && (
                <WheelPalette
                    currentColor={currentRoom.bgColor}
                    onColorChange={color => updateCurrentRoom({ bgColor: color })}
                />
            )}
        </div>
    );
}


