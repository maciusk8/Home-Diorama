import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/WebSocket/useAuth';
import type { EntityState, HomeAssistantContextType, HomeAssistantProviderProps } from '../types/communication';

export const HAContext = React.createContext<HomeAssistantContextType | null>(null);


export const HomeAssistantProvider: React.FC<HomeAssistantProviderProps> = ({ haToken, url, children }) => {
    const { status, lastMessage, sendMessage, error, reconnect } = useAuth(haToken, url);
    const [entities, setEntities] = useState<EntityState[]>([]);
    const subscribedRef = useRef(false);
    const messageId = useRef(1);

    const sendCommand = (message: object) => {
        sendMessage({
            id: messageId.current++,
            ...message
        });
    };

    useEffect(() => {
        if (status === 'authenticated') {
            sendCommand({ type: 'get_states' });
        } else {
            // Reset subscription flag on disconnect/reconnect
            subscribedRef.current = false;
        }
    }, [status]);

    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.type === 'result' && lastMessage.success && Array.isArray(lastMessage.result)) {
            setEntities(lastMessage.result);

            // Po pobraniu stanów, zasubskrybuj eventy (jeśli jeszcze nie zrobiliśmy tego)
            if (!subscribedRef.current) {
                sendCommand({ type: 'subscribe_events', event_type: 'state_changed' });
                subscribedRef.current = true;
            }
        } else if (lastMessage.type === 'event' && lastMessage.event.event_type === 'state_changed') {
            const newState = lastMessage.event.data.new_state;



            setEntities(prev => prev.map(entity =>
                entity.entity_id === newState.entity_id ? newState : entity
            ));
        }
    }, [lastMessage]);

    const contextValue: HomeAssistantContextType = {
        status,
        entities,
        lastMessage,
        sendCommand,
        error,
        reconnect
    };

    return (
        <HAContext.Provider value={contextValue}>
            {children}
        </HAContext.Provider>
    );
};