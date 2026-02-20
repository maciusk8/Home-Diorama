import { type DragEndEvent } from '@dnd-kit/core';

type PositionInput = DragEndEvent['active'] | { clientX: number; clientY: number };

export function calcDropPercent(input: PositionInput, container: HTMLDivElement) {
    const containerRect = container.getBoundingClientRect();

    let left: number;
    let top: number;

    if ('clientX' in input) {
        left = input.clientX;
        top = input.clientY;
    }
    else {
        const draggedRect = input.rect.current.translated;
        if (!draggedRect) return null;

        left = draggedRect.left + (draggedRect.width / 2);
        top = draggedRect.top + (draggedRect.height / 2);
    }

    const xPercent = clamp(((left - containerRect.left) / containerRect.width) * 100, 0, 100);
    const yPercent = clamp(((top - containerRect.top) / containerRect.height) * 100, 0, 100);

    return { x: xPercent, y: yPercent };
}

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}