import { useDraggable } from '@dnd-kit/core';
import { useLongPress, LongPressEventType } from 'use-long-press';
import { useState, useRef } from 'react';
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

  const isLongPress = useRef(false);

  /* 
   * Using 'as const' to ensure the string literal type is preserved for 'detect'.
   * Merging handlers to ensure both dnd-kit and long-press logic works.
   */
  const bind = useLongPress(() => {
    isLongPress.current = true;
  }, {
    onStart: () => { isLongPress.current = false; },
    threshold: 200,
    captureEvent: true,
    cancelOnMovement: 5,
    detect: LongPressEventType.Pointer,
  });

  const longPressHandlers = bind();

  const handleTap = () => {
    if (!isDragging && !isLongPress.current) {
      setIsOpen(true);
    }
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)',
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    zIndex: isDragging ? 10 : 1,
    touchAction: 'none',
  };

  const mergedHandlers = {
    ...listeners,
    ...longPressHandlers,
    onPointerDown: (e: React.PointerEvent) => {
      listeners?.onPointerDown?.(e);
      // Ensure long press handler is called if it exists
      const longPressDown = (longPressHandlers as any).onPointerDown;
      if (typeof longPressDown === 'function') {
        longPressDown(e);
      }
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className="drag-pin"
        style={style}
        {...attributes}
        {...mergedHandlers}
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