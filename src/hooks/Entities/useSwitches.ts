import { useHomeAssistant } from '../WebSocket/useHomeAssistant';

export default function useSwitches() {
    const { sendCommand } = useHomeAssistant();

    const turnOn = (entityId: string) => {
        sendCommand({
            type: 'call_service',
            domain: 'switch',
            service: 'turn_on',
            target: { entity_id: entityId }
        });
    };
    const turnOff = (entityId: string) => {
        sendCommand({
            type: 'call_service',
            domain: 'switch',
            service: 'turn_off',
            target: { entity_id: entityId }
        });
    };
    const toggle = (entityId: string) => {
        sendCommand({
            type: 'call_service',
            domain: 'switch',
            service: 'toggle',
            target: { entity_id: entityId }
        });
    };

    return { turnOn, turnOff, toggle };
}