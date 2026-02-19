import React, { useState, useRef } from 'react';
import type { EntityState } from '../types/communication';
import { useLongPress, LongPressEventType } from 'use-long-press';
import useSwitches from '../hooks/Entities/useSwitches';
import { useLights } from '../hooks/Entities/useLights';
import EntityCardRenderer from './PopUps/EntityCardRenderer';

interface StaticPinProps {
    entityId: string;
    x: number;
    y: number;
    entityData?: EntityState;
    customName?: string;
}

export default function StaticPin({ entityId, x, y, entityData, customName }: StaticPinProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toggle: toggleSwitch } = useSwitches();
    const { toggle: toggleLight } = useLights();
    const isLongPress = useRef(false);

    const bind = useLongPress(() => {
        isLongPress.current = true;
        setIsOpen(true);
    }, {
        onStart: () => { isLongPress.current = false; },
        captureEvent: true,
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
            <div
                className="pin"
                style={style}
                {...bind()}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
            />
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
