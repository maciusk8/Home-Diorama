import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './PopupOverlay.css';

interface PopupOverlayProps {
    onClose?: () => void;
    children: ReactNode;
}

export default function PopupOverlay({ onClose, children }: PopupOverlayProps) {
    return createPortal(
        <div className="popup-overlay" onClick={onClose}>
            {children}
        </div>,
        document.body
    );
}
