import { useDraggable } from '@dnd-kit/core';
import Icon from '@mdi/react';
import { mdiDragVertical } from '@mdi/js';


export function SidebarDraggableItem({ id, data, children }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: data,
  });

  const style: React.CSSProperties = {
    opacity: transform ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sidebar-draggable-item"
    >
      <div
        {...listeners}
        {...attributes}
        className="sidebar-drag-handle"
      >
        <Icon path={mdiDragVertical} size={1} />
      </div>
      {children}
    </div>
  );
}