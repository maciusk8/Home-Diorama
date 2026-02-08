import type { HAConnectionStatus } from './protocol';

export interface HomeAssistantContextType {
    status: HAConnectionStatus;
    error: string | null;

    entities: EntityState[];

    sendMessage: (message: object) => void;
    lastMessage: Record<string, any> | null;

    reconnect: () => void;
}

export interface EntityState {
    entity_id: string;
    state: string;
    attributes: Record<string, any>;
    last_changed: string;
    last_updated: string;
}

export interface HomeAssistantProviderProps {
    haToken: string;
    url: string;
    children: React.ReactNode;
}
