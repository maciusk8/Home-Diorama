import { Button } from "react-bootstrap";
import PopupOverlay from "./PopUps/PopupOverlay";
import { DroppableMap } from "./DnD/DopableMap";
import { useRef, useState } from "react";
import { calcDropPercent } from "../utils/geometry"; 
import { useRooms } from "../hooks/useRooms";
import { DndContext, type DragEndEvent, type DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import DraggablePin from './DnD/DragablePin';

export default function ImageAreaSelector({ imageSrc, entityId }: { imageSrc: string, entityId: string }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const { currentRoom, areaMap, setAreaMap } = useRooms();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activePopupIndex, setActivePopupIndex] = useState<number | null>(null);

    const points = areaMap.get(entityId) ?? [];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
        if (activePopupIndex !== null) {
            setActivePopupIndex(null);
            return;
        }

        if (!mapRef.current) return;

        const result = calcDropPercent(
            { clientX: e.clientX, clientY: e.clientY },
            mapRef.current
        );

        if (!result) return;
        const { x, y } = result;
        const point: [number, number] = [x, y];
        const newMap = new Map(areaMap);
        newMap.set(entityId, [...points, point]);
        setAreaMap(newMap);
    }

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        if (!mapRef.current || !currentRoom) return;
        const { active, over } = event;

        if (over?.id === currentRoom.name && active.data.current?.pinType === 'area_point') {
            const dropPosition = calcDropPercent(active, mapRef.current);
            if (!dropPosition) return;

            const pinIdStr = String(active.id);
            if (pinIdStr.startsWith('pin-area-point-')) {
                const index = parseInt(pinIdStr.replace('pin-area-point-', ''), 10);
                if (!isNaN(index)) {
                    const newPoints = [...points];
                    newPoints[index] = [dropPosition.x, dropPosition.y];
                    const newMap = new Map(areaMap);
                    newMap.set(entityId, newPoints);
                    setAreaMap(newMap);
                }
            }
        }
        setActiveId(null);
    };

    const handleRemovePoint = (indexToRemove: number) => {
        const newPoints = points.filter((_, idx) => idx !== indexToRemove);
        const newMap = new Map(areaMap);
        newMap.set(entityId, newPoints);
        setAreaMap(newMap);
        setActivePopupIndex(null);
    };

    return (
        <PopupOverlay>
            <div className="image-area-selector-container m-auto" style={{ alignItems: 'center' }}>
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <DroppableMap id={currentRoom!.name} ref={mapRef}>
                            <img
                                src={imageSrc}
                                alt="Room"
                                draggable="false"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: 'calc(95vh - 8rem)',
                                    display: 'block',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none'
                                }}
                                onPointerDown={handleClick}
                            />

                            {/* Renderowanie kropek jako DraggablePin */}
                            {points.map((point, index) => (
                                <DraggablePin
                                    key={`area-point-${index}`}
                                    entityId={`area-point-${index}`}
                                    x={point[0]}
                                    y={point[1]}
                                    type="area_point"
                                    disabled={activePopupIndex !== null}
                                    isOpen={activePopupIndex === index}
                                    onOpen={() => setActivePopupIndex(index)}
                                    onClose={() => setActivePopupIndex(null)}
                                    onRemove={() => handleRemovePoint(index)}
                                />
                            ))}
                        </DroppableMap>
                    </div>
                    <DragOverlay dropAnimation={null}>
                        {activeId ? (
                            activeId.startsWith('pin-area-point-') ? (
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: '#0d6efd',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                                    opacity: 0.8
                                }} />
                            ) : (
                                <div className="drag-pin" style={{ transform: 'translate(-50%, -50%)' }} />
                            )
                        ) : null}
                    </DragOverlay>
                </DndContext>

                <div className="d-flex justify-content-end gap-3 mt-3 w-100">
                    <Button variant="secondary" onClick={() => console.log("Close")}>Close</Button>
                    <Button variant="primary" onClick={() => console.log("Save")}>Save</Button>
                </div>
            </div>
        </PopupOverlay>
    );
}