import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from '@dnd-kit/core';
import type { Room } from '../types/rooms';

import ImageDisplay from './ImageDisplay';
import EntityDropdown from './EntityDropdown';
import WheelPalette from './WheelPalette';
import { useEntities } from '../hooks/useEntities';
import { DroppableMap } from './DopableMap';

export default function RoomView({ rooms, setRooms, isEditing }: { rooms: Room[], setRooms: (rooms: Room[]) => void, isEditing: boolean }) {
    const { roomName } = useParams();
    const entitiesFromHook = useEntities();
    const [activeId, setActiveId] = useState<string | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);

    const currentRoom = rooms.find(room => room.name === roomName);

    const changeImage = (newImage: string) => {
        if (currentRoom) {
            const updatedRoom = { ...currentRoom, image: newImage };

            setRooms(rooms.map(room =>
                room.name === currentRoom.name ? updatedRoom : room
            ));
        }
    }

    const changeBackgroundColor = (color: string) => {
        if (currentRoom) {
            const updatedRoom = { ...currentRoom, bgColor: color };

            setRooms(rooms.map(room =>
                room.name === currentRoom.name ? updatedRoom : room
            ));
        }
    }

    useEffect(() => {
        if (currentRoom?.bgColor) {
            document.body.style.backgroundColor = currentRoom.bgColor;
        } else {
            document.body.style.backgroundColor = '';
        }
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, [currentRoom?.bgColor]);

    if (!currentRoom) {
        return <div style={{ color: 'red' }}>Room not found: {roomName}</div>;
    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && over.id === currentRoom?.name && mapRef.current) {
            const containerRect = mapRef.current.getBoundingClientRect();
            const draggedRect = active.rect.current.translated;

            if (draggedRect) {
                let x = draggedRect.left - containerRect.left;
                let y = draggedRect.top - containerRect.top;

                let xPercent = (x / containerRect.width) * 100;
                let yPercent = (y / containerRect.height) * 100;

                xPercent = Math.max(0, Math.min(100, xPercent));
                yPercent = Math.max(0, Math.min(100, yPercent));

                const newEntity = {
                    id: active.id as string,
                    x: xPercent,
                    y: yPercent
                };

                const updatedRoom = {
                    ...currentRoom!,
                    entities: [...currentRoom!.entities, newEntity]
                };

                setRooms(rooms.map(r => r.name === currentRoom!.name ? updatedRoom : r));
            }
        }

        setActiveId(null);
    }

    return (
        <div className='roomView'>
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                {isEditing && (
                    <div className="entity-sidebar">
                        <EntityDropdown entities={entitiesFromHook} />
                    </div>
                )}
                <DroppableMap id={currentRoom.name} ref={mapRef}>
                    <ImageDisplay image={currentRoom.image} changeImage={changeImage} isEditing={isEditing} />
                    {currentRoom.entities.map(entity => (
                        <div
                            key={entity.id}
                            className="drag-pin"
                            style={{
                                position: 'absolute',
                                left: `${entity.x}%`,
                                top: `${entity.y}%`,
                                transform: 'translate(-50%, -50%)', // Center the pin on the coordinates
                            }}
                        />
                    ))}
                </DroppableMap>
                <DragOverlay>
                    {activeId ? <div className="drag-pin" /> : null}
                </DragOverlay>
            </DndContext>
            {isEditing && (
                <WheelPalette
                    currentColor={currentRoom.bgColor}
                    onColorChange={changeBackgroundColor}
                />
            )}
        </div>
    );
}