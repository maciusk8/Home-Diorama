import { useDraggable } from '@dnd-kit/core';

import { useState } from 'react';
import type { EntityState } from '../../types/communication';
import EntityEditCard from '../PopUps/EntityEditCard';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

interface DraggablePinProps {
  entityId: string;
  x: number;
  y: number;
  entityData?: EntityState;
  customName?: string;
  onRename?: (name: string) => void;
  onRemove?: () => void;
  type?: 'entity' | 'area_point';
  disabled?: boolean;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function DraggablePin({
  entityId, x, y, entityData, customName, onRename, onRemove, type = 'entity',
  disabled = false, isOpen: controlledIsOpen, onOpen, onClose
}: DraggablePinProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pin-${entityId}`,
    data: { type: 'pin', entityId: entityId, pinType: type },
    disabled
  });

  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging && !disabled) {
      if (type === 'area_point') {
        setClickPos({ x: e.clientX, y: e.clientY });
      }
      if (controlledIsOpen === undefined) {
        setLocalIsOpen(true);
      }
      if (onOpen) onOpen();
    }
  };

  const handleClose = () => {
    if (controlledIsOpen === undefined) {
      setLocalIsOpen(false);
    }
    if (onClose) onClose();
  };

  const isAreaPoint = type === 'area_point';

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    zIndex: isDragging ? 10 : 1,
    touchAction: 'none',
    ...(isAreaPoint ? {
      width: '12px',
      height: '12px',
      backgroundColor: '#0d6efd',
      border: 'none',
      borderRadius: '50%',
      boxShadow: '0 0 4px rgba(0,0,0,0.5)'
    } : {})
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={isAreaPoint ? "" : "drag-pin"}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleTap}
      />
      {isOpen && type === 'entity' && (
        <EntityEditCard
          entityId={entityId}
          customName={customName}
          entityData={entityData}
          onClose={handleClose}
          onRename={onRename || (() => { })}
          onRemove={onRemove || (() => { })}
        />
      )}
      {isOpen && type === 'area_point' && (
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