import React, { useState, useRef } from 'react';
import type { EntityState } from '@/shared/types/communication';
import { useLongPress, LongPressEventType } from 'use-long-press';
import { useEntityRegistry } from '@/features/entities/entityRegistry';
import EntityCardRenderer from '@/features/entities/components/EntityCardRenderer';
import useCurrentRoom from '@/shared/hooks/useCurrentRoom';
import { translateToString } from '@/shared/utils/geometry';
import '@/features/dnd/components/DragPin.css';

interface StaticPinProps {
    entityId: string;
    x: number;
    y: number;
    entityData?: EntityState;
    customName?: string;
}

export default function StaticEntityPin({ entityId, x, y, entityData, customName }: StaticPinProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { areaMap } = useCurrentRoom();
    const isLongPress = useRef(false);

    const entityArea = areaMap.get(entityId);
    const domain = entityId.split('.')[0];
    const { getRegistryEntry } = useEntityRegistry();
    const registryEntry = getRegistryEntry(domain);

    const bind = useLongPress(() => {
        isLongPress.current = true;
        setIsOpen(true);
    }, {
        onStart: () => { isLongPress.current = false; },
        captureEvent: true,
        threshold: 200,
        detect: LongPressEventType.Pointer,
    });

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: 1,
    };

    const handleClick = () => {
        if (isLongPress.current) return;

        if (registryEntry.onPinClick) {
            registryEntry.onPinClick(entityId, {
                openCard: () => setIsOpen(true)
            });
        } else {
            setIsOpen(true);
        }
    };

    return (
        <>
            {entityArea && entityArea.length > 0 ? (
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}>
                    <polygon
                        points={translateToString(entityArea)}
                        vectorEffect="non-scaling-stroke"
                        style={{
                            fill: 'transparent',
                            stroke: 'transparent',
                            cursor: 'pointer',
                            pointerEvents: 'auto'
                        }}
                        {...bind()}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                    />
                </svg>
            ) : (
                <div
                    className="pin"
                    style={style}
                    {...bind()}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                />
            )}

            {isOpen && (
                <EntityCardRenderer
                    entityId={entityId}
                    customName={customName}
                    entityData={entityData}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
