import React, { useState, useRef } from 'react';
import type { EntityState } from '../types/communication';
import { useLongPress, LongPressEventType } from 'use-long-press';
import useSwitches from '../hooks/Entities/useSwitches';
import { useLights } from '../hooks/Entities/useLights';
import EntityCardRenderer from './PopUps/EntityCardRenderer';
import { useRooms } from '../hooks/useRooms';
import { translateToString } from '../utils/geometry';

interface StaticPinProps {
    entityId: string;
    x: number;
    y: number;
    entityData?: EntityState;
    customName?: string;
}

export default function StaticEntityPin({ entityId, x, y, entityData, customName }: StaticPinProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toggle: toggleSwitch } = useSwitches();
    const { toggle: toggleLight } = useLights();
    const { areaMap } = useRooms();
    const isLongPress = useRef(false);

    const entityArea = areaMap.get(entityId);

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

    const domain = entityId.split('.')[0];

    const handleClick = () => {
        if (isLongPress.current) return;

        switch (domain) {
            case 'switch':
                toggleSwitch(entityId);
                break;
            case 'light':
                toggleLight(entityId);
                break;
            default:
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
                    domain={domain}
                    customName={customName}
                    entityData={entityData}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
