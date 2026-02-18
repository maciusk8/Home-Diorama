import { useState, useEffect } from 'react';
import AbstractEntityCard from './AbstractEntityCard';
import { type BaseEntityCardProps } from '../../types/EntityCard';
import useSwitches from '../../hooks/Entities/useSwitches';
import Icon from '@mdi/react';
import { mdiPower } from '@mdi/js';
import { getRelativeTime } from '../../utils/time';
import { DndContext, useDraggable, useSensor, useSensors, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

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
    const isOn = entityData?.state === 'on';
    const [timeAgo, setTimeAgo] = useState(getRelativeTime(entityData?.last_updated));

    useEffect(() => {
        setTimeAgo(getRelativeTime(entityData?.last_updated));
        const interval = setInterval(() => {
            setTimeAgo(getRelativeTime(entityData?.last_updated));
        }, 60000);
        return () => clearInterval(interval);
    }, [entityData?.last_updated]);

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
                toggle(entityId);
            } else if (isOn && delta.y > threshold) { // On -> Drag Down -> Off
                toggle(entityId);
            }
        } else if (Math.abs(delta.y) < 5) {
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
                            onClick={() => toggle(entityId)}
                            style={{
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%',
                                borderRadius: '3.5rem',
                                backgroundColor: isOn ? '#ffc107' : '#2b2930', 
                                transition: 'background-color 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                position: 'relative' 
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
