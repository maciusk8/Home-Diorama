import { type ReactNode } from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import PopupOverlay from './PopupOverlay';


function Header({ name, onClose }: { name: string; onClose: () => void }) {
    return (
        <div className="entity-card-header">
            <h3 className="entity-card-name">{name}</h3>
            <button className="entity-card-close" onClick={onClose}>
                <Icon path={mdiClose} size={0.8} />
            </button>
        </div>
    );
}

function State({ value }: { value: string }) {
    return <p className="entity-card-state">{value}</p>;
}

function Id({ value }: { value: string }) {
    return <p className="entity-card-id">{value}</p>;
}



function Body({ children }: { children: ReactNode }) {
    return <div className="entity-card-body">{children}</div>;
}


function AbstractEntityCard({ onClose, children }: { onClose: () => void; children: ReactNode }) {
    return (
        <PopupOverlay onClose={onClose}>
            <div className="entity-card">
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
