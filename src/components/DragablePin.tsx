import { useDraggable } from '@dnd-kit/core';
import { useRef } from 'react';

interface DraggablePinProps {
  id: string;
  x: number;
  y: number;
  onTap?: () => void;
  isEditing: boolean;
}

const LONG_PRESS_MS = 200;

export function DraggablePin({ id, x, y, onTap, isEditing }: DraggablePinProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pin-${id}`,
    data: { type: 'pin', entityId: id },
  });

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didDrag = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    didDrag.current = false;
    pressTimer.current = setTimeout(() => {
      didDrag.current = true;
    }, LONG_PRESS_MS);
    listeners?.onPointerDown?.(e);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (!didDrag.current && !isDragging) {
      onTap?.();
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
  };

  return (
    <div
      ref={setNodeRef}
      className={isEditing ? "drag-pin" : "pin"}
      style={style}
      {...listeners}
      {...attributes}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
}