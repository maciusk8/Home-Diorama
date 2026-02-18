import { useContext } from 'react';
import { HAContext } from '../../providers/HomeAssistantProvider';

export function useHomeAssistant() {
    const context = useContext(HAContext);

    if (!context) {
        throw new Error('useHomeAssistant must be used within HomeAssistantProvider');
    }

    return context;
}
