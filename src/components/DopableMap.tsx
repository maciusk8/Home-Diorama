import React, { forwardRef } from 'react';
import { useDroppable } from '@dnd-kit/core';

export const DroppableMap = forwardRef<HTMLDivElement, { children: React.ReactNode; id: string }>(
  ({ children, id }, refFromParent) => {

    const { setNodeRef, isOver } = useDroppable({
      id: id,
    });

    const setRefs = (node: HTMLDivElement | null) => {
      setNodeRef(node);
      if (typeof refFromParent === 'function') {
        refFromParent(node);
      } else if (refFromParent) {
        refFromParent.current = node;
      }
    };

    const style: React.CSSProperties = {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      position: 'relative',
      outline: isOver ? '4px solid #4caf50' : 'none',
      transition: 'outline 0.2s',
      overflow: 'hidden',
    };

    return (
      <div ref={setRefs} style={style}>
        {children}
      </div>
    );
  }
);