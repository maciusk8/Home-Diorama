import { useHomeAssistant } from "./useHomeAssistant";

export function useEntities() {
    const context = useHomeAssistant()

    if (!context) {
        throw new Error('useEntities must be used within HomeAssistantProvider');
    }

    return context.entities;
}