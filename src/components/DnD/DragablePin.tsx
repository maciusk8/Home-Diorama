import { useDraggable } from '@dnd-kit/core';

import { useState } from 'react';
import type { EntityState } from '../../types/communication';
import EntityEditCard from '../PopUps/EntityEditCard';

interface DraggablePinProps {
  entityId: string;
  x: number;
  y: number;
  entityData?: EntityState;
  customName?: string;
  onRename?: (name: string) => void;
  onRemove?: () => void;
}

export default function DraggablePin({ entityId, x, y, entityData, customName, onRename, onRemove }: DraggablePinProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pin-${entityId}`,
    data: { type: 'pin', entityId: entityId },
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleTap = () => {
    if (!isDragging) {
      setIsOpen(true);
    }
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    zIndex: isDragging ? 10 : 1,
    touchAction: 'none',
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className="drag-pin"
        style={style}
        {...attributes}
        {...listeners}
        {...attributes}
        {...listeners}
        onClick={handleTap}
      />
      {isOpen && (
        <EntityEditCard
          entityId={entityId}
          customName={customName}
          entityData={entityData}
          onClose={() => setIsOpen(false)}
          onRename={onRename || (() => { })}
          onRemove={onRemove || (() => { })}
        />
      )}
    </>
  );
}