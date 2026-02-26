import { useState } from 'react';
import type { EntityState } from '@/shared/types/communication';
import EntityEditCard from '@/features/entities/components/EntityEditCard';
import DraggablePin from '@/features/dnd/components/DraggablePin';

interface DraggableEntityPinProps {
  entityId: string;
  x: number;
  y: number;
  entityData?: EntityState;
  customName?: string;
  onRename?: (name: string) => void;
  onRemove?: () => void;
}

export default function DraggableEntityPin({
  entityId, x, y, entityData, customName, onRename, onRemove
}: DraggableEntityPinProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DraggablePin
        pinId={entityId}
        x={x}
        y={y}
        dragData={{ type: 'pin', entityId }}
        className="drag-pin"
        onClick={() => setIsOpen(true)}
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