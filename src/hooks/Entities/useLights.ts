import { useHomeAssistant } from '../WebSocket/useHomeAssistant';

export function useLights() {
    const { entities, sendCommand } = useHomeAssistant();

    const lights = entities.filter(e => e.entity_id.startsWith('light.'));

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

    const setHsColor = (entityId: string, h: number, s: number) => {
        sendCommand({
            type: 'call_service',
            domain: 'light',
            service: 'turn_on',
            target: { entity_id: entityId },
            service_data: { hs_color: [h, s] }
        });
    }

    const setColorTemp = (entityId: string, temp: number) => {
        sendCommand({
            type: 'call_service',
            domain: 'light',
            service: 'turn_on',
            target: { entity_id: entityId },
            service_data: { kelvin: temp }
        });
    }

    return { lights, setBrightness, setColor, setHsColor, setColorTemp };
}