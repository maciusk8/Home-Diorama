import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import DraggablePin from '@/features/dnd/components/DraggablePin';

interface DraggableAreaPointProps {
    pointId: string;
    x: number;
    y: number;
    disabled?: boolean;
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onRemove?: () => void;
}

const AREA_POINT_STYLE: React.CSSProperties = {
    width: '12px',
    height: '12px',
    backgroundColor: '#0d6efd',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 0 4px rgba(0,0,0,0.5)',
};

export default function DraggableAreaPoint({
    pointId, x, y, disabled = false,
    isOpen: controlledIsOpen, onOpen, onClose, onRemove
}: DraggableAreaPointProps) {
    const [localIsOpen, setLocalIsOpen] = useState(false);
    const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;

    const handleClick = (e: React.MouseEvent) => {
        setClickPos({ x: e.clientX, y: e.clientY });
        if (controlledIsOpen === undefined) setLocalIsOpen(true);
        if (onOpen) onOpen();
    };

    const handleClose = () => {
        if (controlledIsOpen === undefined) setLocalIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <>
            <DraggablePin
                pinId={pointId}
                x={x}
                y={y}
                dragData={{ type: 'pin', entityId: pointId, pinType: 'area_point' }}
                disabled={disabled}
                extraStyle={AREA_POINT_STYLE}
                onClick={handleClick}
            />
            {isOpen && onRemove && (
                <div style={{
                    position: 'fixed',
                    top: `${clickPos.y}px`,
                    left: `${clickPos.x}px`,
                    transform: 'translate(-50%, -150%)',
                    zIndex: 9999,
                    backgroundColor: 'white',
                    padding: '4px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onRemove) onRemove();
                        handleClose();
                    }}>
                    <Icon path={mdiClose} size={0.8} color="#dc3545" />
                </div>
            )}
        </>
    );
}
