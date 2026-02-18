import { type ReactNode } from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import PopupOverlay from './PopupOverlay';

function Header({ name }: { name: string }) {
    return (
        <div className="entity-card-header">
            <h3 className="entity-card-title">{name}</h3>
        </div>
    );
}

function State({ value, subtext }: { value: string, subtext?: string }) {
    return (
        <div className="entity-state-container">
            <h2 className="entity-state-text">{value}</h2>
            {subtext && <p className="entity-state-subtext">{subtext}</p>}
        </div>
    );
}

function Id({ value }: { value: string }) {
    return null;
}

function Body({ children }: { children: ReactNode }) {
    return <div className="entity-card-body">{children}</div>;
}

function AbstractEntityCard({ onClose, children }: { onClose: () => void; children: ReactNode }) {
    return (
        <PopupOverlay onClose={onClose}>
            <div className="entity-card" onClick={(e) => e.stopPropagation()}>
                <button className="entity-card-icon-btn entity-card-close-btn" onClick={onClose}>
                    <Icon path={mdiClose} size={1} />
                </button>
                {children}
            </div>
        </PopupOverlay>
    );
}

AbstractEntityCard.Header = Header;
AbstractEntityCard.State = State;
AbstractEntityCard.Id = Id;
AbstractEntityCard.Body = Body;

export default AbstractEntityCard;
