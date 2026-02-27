import { useState, useEffect } from 'react';
import AbstractEntityCard from '@/features/entities/components/AbstractEntityCard';
import { type BaseEntityCardProps } from '@/shared/types/EntityCard';
import useSwitches from '@/features/entities/hooks/useSwitches';
import Icon from '@mdi/react';
import { mdiPower } from '@mdi/js';
import { getRelativeTime } from '@/shared/utils/time';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import './EntityCard.css';

//vibe coded, needs refactor and cleanup, but works and look good enough for now.

function DraggableThumb({ isOn }: { isOn: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: 'switch-thumb',
    });

    let clampedY = 0;

    if (transform) {
        if (isOn) {
            clampedY = Math.max(0, Math.min(transform.y, 100));
        } else {
            clampedY = Math.max(-100, Math.min(transform.y, 0));
        }
    }

    const style: React.CSSProperties = {
        transform: transform ? `translate3d(0px, ${clampedY}px, 0)` : undefined,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        position: 'absolute',
        top: isOn ? '0.625rem' : 'calc(100% - 6.25rem)',
        left: '50%',
        marginLeft: '-2.8125rem',
        width: '5.625rem',
        height: '5.625rem',
        backgroundColor: isOn ? '#ffffff' : '#46444b',
        borderRadius: '50%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 2,
        transition: isDragging ? 'none' : 'top 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), background-color 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isOn ? '#ffca28' : '#e2e2e2'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            <Icon path={mdiPower} size={1.5} />
        </div>
    );
}

export default function EntitySwitchCard({ entityId, customName, entityData, onClose }: BaseEntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;
    const { toggle } = useSwitches();
    const [optimisticState, setOptimisticState] = useState<string | null>(null);
    const currentState = optimisticState || entityData?.state;
    const isOn = currentState === 'on';

    // Reset optimistic state when real update arrives
    useEffect(() => {
        setOptimisticState(null);
    }, [entityData?.state]);

    const [timeAgo, setTimeAgo] = useState(getRelativeTime(entityData?.last_updated));

    useEffect(() => {
        if (optimisticState) {
            setTimeAgo('Just now');
            return;
        }
        setTimeAgo(getRelativeTime(entityData?.last_updated));
        const interval = setInterval(() => {
            setTimeAgo(getRelativeTime(entityData?.last_updated));
        }, 60000);
        return () => clearInterval(interval);
    }, [entityData?.last_updated, optimisticState]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { delta } = event;
        const threshold = 30;

        if (Math.abs(delta.y) > threshold) {
            if (!isOn && delta.y < -threshold) { // Off -> Drag Up -> On
                setOptimisticState('on');
                toggle(entityId);
            } else if (isOn && delta.y > threshold) { // On -> Drag Down -> Off
                setOptimisticState('off');
                toggle(entityId);
            }
        } else if (Math.abs(delta.y) < 5) {
            setOptimisticState(isOn ? 'off' : 'on');
            toggle(entityId);
        }
    };

    return (
        <AbstractEntityCard onClose={onClose}>
            <AbstractEntityCard.Header name={displayName} />

            <AbstractEntityCard.Body>
                <AbstractEntityCard.State
                    value={isOn ? 'On' : 'Off'}
                    subtext={timeAgo}
                />

                <DndContext
                    sensors={sensors}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <div className="big-switch-container">
                        <div
                            onClick={() => {
                                setOptimisticState(isOn ? 'off' : 'on');
                                toggle(entityId);
                            }}
                            className="entity-switch-card-custom-slider"
                            style={{
                                backgroundColor: isOn ? '#ffc107' : undefined,
                            }}
                        >
                            {/* Track only thumb is draggable overlay */}
                        </div>

                        <DraggableThumb isOn={isOn} />
                    </div>
                </DndContext>
            </AbstractEntityCard.Body>
        </AbstractEntityCard>
    );
}
