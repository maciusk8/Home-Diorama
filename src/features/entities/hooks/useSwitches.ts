import { useHomeAssistant } from '@/shared/hooks/useHomeAssistant';

export default function useSwitches() {
    const { sendCommand } = useHomeAssistant();

    const turnOn = (entityId: string) => {
        const domain = entityId.split('.')[0];
        sendCommand({
            type: 'call_service',
            domain: domain,
            service: 'turn_on',
            target: { entity_id: entityId }
        });
    };
    const turnOff = (entityId: string) => {
        const domain = entityId.split('.')[0];
        sendCommand({
            type: 'call_service',
            domain: domain,
            service: 'turn_off',
            target: { entity_id: entityId }
        });
    };
    const toggle = (entityId: string) => {
        const domain = entityId.split('.')[0];
        sendCommand({
            type: 'call_service',
            domain: domain,
            service: 'toggle',
            target: { entity_id: entityId }
        });
    };

    return { turnOn, turnOff, toggle };
}