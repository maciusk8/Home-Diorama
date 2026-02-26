import { Button } from "react-bootstrap";
import PopupOverlay from "@/shared/components/PopupOverlay";
import { DroppableMap } from "@/features/dnd/components/DroppableMap";
import { useRef, useState } from "react";
import { calcDropPercent, translateToString } from "@/shared/utils/geometry";
import useCurrentRoom from "@/shared/hooks/useCurrentRoom";
import { DndContext, type DragEndEvent, type DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import DraggableAreaPoint from '@/features/dnd/components/DraggableAreaPoint';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import './ImageAreaSelector.css';

export default function ImageAreaSelector({ imageSrc, entityId, onClose }: { imageSrc: string, entityId: string, onClose: () => void }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const { room: currentRoom, areaMap } = useCurrentRoom();
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activePopupIndex, setActivePopupIndex] = useState<number | null>(null);
    const [value, setValue] = useState<[number, number][]>(areaMap.get(entityId) ?? []);
    const [isSaved, setIsSaved] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const saveAreaMutation = useMutation({
        mutationFn: (points: [number, number][]) =>
            fetch(`/api/local/areas/by-pin/${entityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    points,
                }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homeData'] }),
    });

    const handleClick = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsSaved(false);

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
        setValue([...value, point]);
    }

    const handleDragStart = (event: DragStartEvent) => {
        setIsSaved(false);
        setActiveId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setIsSaved(false);
        if (!mapRef.current || !currentRoom) return;
        const { active, over } = event;

        if (over?.id === currentRoom.id && active.data.current?.pinType === 'area_point') {
            const dropPosition = calcDropPercent(active, mapRef.current);
            if (!dropPosition) return;

            const pinIdStr = String(active.id);
            if (pinIdStr.startsWith('pin-area-point-')) {
                const index = parseInt(pinIdStr.replace('pin-area-point-', ''), 10);
                if (!isNaN(index)) {
                    const newValue = [...value];
                    newValue[index] = [dropPosition.x, dropPosition.y];
                    setValue(newValue);
                }

            }
        }
        setActiveId(null);
    };

    const handleRemovePoint = (indexToRemove: number) => {
        setIsSaved(false);
        const newValue = value.filter((_, idx) => idx !== indexToRemove);
        setValue(newValue);
        setActivePopupIndex(null);
    };

    const handleSave = () => {
        saveAreaMutation.mutate(value);
        setIsSaved(true);
    };

    return (
        <PopupOverlay>
            <div className="image-area-selector-container m-auto image-area-selector-container-inner">
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="image-area-selector-relative-box">
                        <DroppableMap id={currentRoom!.id} ref={mapRef}>
                            <img
                                src={imageSrc}
                                alt="Room"
                                draggable="false"
                                className="image-area-selector-img"
                                onPointerDown={handleClick}
                            />

                            {value.map((point, index) => (
                                <DraggableAreaPoint
                                    key={`area-point-${index}`}
                                    pointId={`area-point-${index}`}
                                    x={point[0]}
                                    y={point[1]}
                                    disabled={activePopupIndex !== null}
                                    isOpen={activePopupIndex === index}
                                    onOpen={() => setActivePopupIndex(index)}
                                    onClose={() => setActivePopupIndex(null)}
                                    onRemove={() => handleRemovePoint(index)}
                                />
                            ))}

                            <svg
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                className="image-area-selector-svg"
                            >
                                <polygon points={translateToString(value)}
                                    vectorEffect="non-scaling-stroke"
                                    className="image-area-selector-polygon"
                                />
                            </svg>
                        </DroppableMap>
                    </div>
                    <DragOverlay dropAnimation={null}>
                        {activeId ? (
                            activeId.startsWith('pin-area-point-') ? (
                                <div className="image-area-selector-drag-dot" />
                            ) : (
                                <div className="drag-pin image-area-selector-drag-pin-translate" />
                            )
                        ) : null}
                    </DragOverlay>
                </DndContext>

                <div className="d-flex justify-content-end gap-3 mt-3 w-100">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button variant={isSaved ? "success" : "primary"} onClick={handleSave}>
                        {isSaved ? "Saved!" : "Save"}
                    </Button>
                </div>
            </div>
        </PopupOverlay>
    );
}