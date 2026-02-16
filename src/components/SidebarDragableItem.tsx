import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function SidebarDraggableItem({ id, data, children }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: data,
  });

  const style = {
    opacity: transform ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}