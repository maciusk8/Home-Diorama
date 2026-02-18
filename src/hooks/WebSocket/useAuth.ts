import { useWebSocket } from '../WebSocket/useWebSocket';
import { useState, useEffect } from 'react';
import type { HAConnectionStatus } from '../../types/protocol';

export function useAuth(haToken: string, url: string) {
    const { connectionStatus, lastMessage, error, sendMessage, reconnect } = useWebSocket(url);
    const [status, setStatus] = useState<HAConnectionStatus>('disconnected');

    useEffect(() => {
        if (connectionStatus === 'connecting') {
            setStatus('connecting');
        } else if (connectionStatus === 'disconnected') {
            setStatus('disconnected');
        }
    }, [connectionStatus]);

    useEffect(() => {
        if (!lastMessage) return;

        switch (lastMessage.type) {
            case 'auth_required':
                setStatus('authenticating');
                sendMessage({
                    type: 'auth',
                    access_token: haToken
                });
                break;

            case 'auth_ok':
                setStatus('authenticated'); 
                console.log('Successfully authenticated with Home Assistant');
                break;

            case 'auth_invalid':
                setStatus('auth_failed');
                console.error('Authentication failed:', lastMessage.message);
                break;
        }
    }, [lastMessage, haToken, sendMessage]);

    return {
        status,      
        lastMessage,
        error,
        sendMessage,
        reconnect
    };
}
