import { useHomeAssistant } from '../WebSocket/useHomeAssistant';

export function useLights() {
    const { entities, sendCommand } = useHomeAssistant();
    
    const lights = entities.filter(e => e.entity_id.startsWith('light.'));

    const turnOn = (entityId: string) => {
        sendCommand({
            type: 'call_service',
            domain: 'light',
            service: 'turn_on',
            target: { entity_id: entityId }
        });
    };
    const turnOff = (entityId: string) => {
        sendCommand({
            type: 'call_service',
            domain: 'light',
            service: 'turn_off',
            target: { entity_id: entityId }
        });
    };
    const toggle = (entityId: string) => {
        sendCommand({
            type: 'call_service',
            domain: 'light',
            service: 'toggle',
            target: { entity_id: entityId }
        });
    };
    const setBrightness = (entityId: string, brightness: number) => {
        sendCommand({
            type: 'call_service',
            domain: 'light',
            service: 'turn_on',
            target: { entity_id: entityId },
            service_data: { brightness }
        });
    };
    const setColor = (entityId: string, color: string) => {
        sendCommand({
            type: 'call_service',
            domain: 'light',
            service: 'turn_on',
            target: { entity_id: entityId },
            service_data: { color_name: color }
        });
    }

    return { lights, turnOn, turnOff, toggle, setBrightness };
}