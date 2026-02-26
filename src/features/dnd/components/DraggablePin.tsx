import { useDraggable } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import './DragPin.css';

interface DraggablePinProps {
    pinId: string;
    x: number;
    y: number;
    dragData?: Record<string, unknown>;
    disabled?: boolean;
    className?: string;
    extraStyle?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
    children?: ReactNode;
}

/**
 * Base draggable pin. Handles useDraggable hook, positioning,
 * and opacity on drag. Specific pin variants compose this.
 */
export default function DraggablePin({
    pinId, x, y, dragData = {}, disabled = false,
    className, extraStyle, onClick, children
}: DraggablePinProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `pin-${pinId}`,
        data: dragData,
        disabled,
    });

    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        opacity: isDragging ? 0.4 : 1,
        cursor: 'grab',
        zIndex: isDragging ? 10 : 1,
        touchAction: 'none',
        ...extraStyle,
    };

    return (
        <div
            ref={setNodeRef}
            className={className}
            style={style}
            {...attributes}
            {...listeners}
            onClick={(e) => {
                e.stopPropagation();
                if (!isDragging && !disabled && onClick) onClick(e);
            }}
        >
            {children}
        </div>
    );
}
