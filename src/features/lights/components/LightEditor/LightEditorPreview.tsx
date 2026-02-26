import { useRef, useState } from "react";
import { DndContext, type DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DroppableMap } from "@/features/dnd/components/DroppableMap";
import DraggableAreaPoint from '@/features/dnd/components/DraggableAreaPoint';
import { calcDropPercent } from "@/shared/utils/geometry";
import { getLightStyle } from '@/features/lights/utils/lightUtils';
import type { LightConfig } from "@/features/rooms/types/rooms";
import useCurrentRoom from '@/shared/hooks/useCurrentRoom';
import './LightEditor.css';

interface LightEditorPreviewProps {
    imageSrc: string;
    configs: LightConfig[];
    activeIndex: number;
    entityData?: any;
    updateConfig: (index: number, updates: Partial<LightConfig>) => void;
    setActiveIndex: (index: number) => void;
    setIsSaved: (val: boolean) => void;
}

export default function LightEditorPreview({
    imageSrc,
    configs,
    activeIndex,
    entityData,
    updateConfig,
    setActiveIndex,
    setIsSaved
}: LightEditorPreviewProps) {
    const { room: currentRoom } = useCurrentRoom();
    const mapRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const [dragId, setDragId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const handleDragStart = (e: any) => {
        setIsSaved(false);
        setDragId(String(e.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setIsSaved(false);
        setDragId(null);
        if (!imageContainerRef.current) return;
        const { active, over } = event;

        if (over?.id === (currentRoom?.name || 'room') && String(active.id).startsWith('pin-light-center-')) {
            const idx = parseInt(String(active.id).replace('pin-light-center-', ''), 10);
            const dropPosition = calcDropPercent(active, imageContainerRef.current);
            if (!dropPosition || isNaN(idx)) return;
            updateConfig(idx, { position: { x: dropPosition.x, y: dropPosition.y } });
            setActiveIndex(idx);
        }
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="light-editor-preview-dnd">
                <DroppableMap id={currentRoom?.name || 'room'} ref={mapRef}>
                    <div ref={imageContainerRef} className="light-editor-preview-img-container">
                        <img
                            src={imageSrc}
                            alt="Room Preview"
                            draggable="false"
                            className="light-editor-preview-img"
                        />

                        {configs.map((config, idx) => (
                            <div key={`light-style-${idx}`} style={getLightStyle(config, entityData, true)} />
                        ))}

                        {configs.map((config, idx) => (
                            <DraggableAreaPoint
                                key={`light-center-${idx}`}
                                pointId={`light-center-${idx}`}
                                x={config.position.x}
                                y={config.position.y}
                                disabled={false}
                                isOpen={activeIndex === idx}
                                onOpen={() => setActiveIndex(idx)}
                            />
                        ))}
                    </div>
                </DroppableMap>
            </div>

            <DragOverlay dropAnimation={null}>
                {dragId?.startsWith('pin-light-center-') && (
                    <div className="light-center-drag-pin" />
                )}
            </DragOverlay>
        </DndContext>
    );
}
