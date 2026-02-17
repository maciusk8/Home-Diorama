import { useDraggable } from '@dnd-kit/core';
import Icon from '@mdi/react';
import { mdiDragVertical } from '@mdi/js';


export function SidebarDraggableItem({ id, data, children }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: data,
  });

  const style = {
    opacity: transform ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div
        {...listeners}
        {...attributes}
        className="sidebar-drag-handle"
        style={{ cursor: 'grab', marginRight: '8px', display: 'flex', alignItems: 'center' }}
      >
        <Icon path={mdiDragVertical} size={1} />
      </div>
      {children}
    </div>
  );
}