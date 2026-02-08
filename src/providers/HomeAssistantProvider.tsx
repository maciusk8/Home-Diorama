import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { EntityState, HomeAssistantContextType, HomeAssistantProviderProps } from '../types/communication';

export const HAContext = React.createContext<HomeAssistantContextType | null>(null);


export const HomeAssistantProvider: React.FC<HomeAssistantProviderProps> = ({ haToken, url, children }) => {
    const { status, lastMessage, sendMessage, error, reconnect } = useAuth(haToken, url);
    const [entities, setEntities] = useState<EntityState[]>([]);
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
        }
    }, [status]);

    useEffect(() => {
        if (!lastMessage) return;

        if (lastMessage.type === 'result' && lastMessage.success && Array.isArray(lastMessage.result)) {
            setEntities(lastMessage.result);
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