import type { ReactNode } from 'react';
import './PopupOverlay.css';

interface PopupOverlayProps {
    onClose?: () => void;
    children: ReactNode;
}

export default function PopupOverlay({ onClose, children }: PopupOverlayProps) {
    return (
        <div className="popup-overlay" onClick={onClose}>
            {children}
        </div>
    );
}
