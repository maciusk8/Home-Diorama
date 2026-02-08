import { useMemo } from 'react';
import { useHomeAssistant } from './useHomeAssistant';

export function useLights() {
    const { entities, sendMessage } = useHomeAssistant();

    const lights = useMemo(() => {
        return entities.filter(entity => entity.entity_id.startsWith('light.'));
    }, [entities]);

    const turnOn = (entityId: string) => {
        sendMessage({
            type: 'call_service',
            domain: 'light',
            service: 'turn_on',
            target: { entity_id: entityId }
        });
    };

    const turnOff = (entityId: string) => {
        sendMessage({
            type: 'call_service',
            domain: 'light',
            service: 'turn_off',
            target: { entity_id: entityId }
        });
    };

    const toggle = (entityId: string) => {
        sendMessage({
            type: 'call_service',
            domain: 'light',
            service: 'toggle',
            target: { entity_id: entityId }
        });
    };

    const setBrightness = (entityId: string, brightness: number) => {
        sendMessage({
            type: 'call_service',
            domain: 'light',
            service: 'turn_on',
            target: { entity_id: entityId },
            service_data: { brightness }
        });
    };

    return { lights, turnOn, turnOff, toggle, setBrightness };
}
