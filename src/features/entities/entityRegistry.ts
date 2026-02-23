import { useMemo } from 'react';
import type { EntityState } from '@/shared/types/communication';
import EntityLightCard from '@/features/lights/components/EntityLightCard';
import EntitySwitchCard from '@/features/entities/components/EntitySwitchCard';
import EntityDefaultCard from '@/features/entities/components/EntityDefaultCard';
import useSwitches from '@/features/entities/hooks/useSwitches';

// ============================================================================
// DEVELOPER GUIDE: HOW TO ADD A NEW ENTITY CARD
// ============================================================================
// To add support for a new Home Assistant entity domain (e.g., 'media_player', 'climate'):
//
// 1. Create your Card Component
//    Create a new React component for your card (e.g., `EntityMediaCard`). 
//    This component MUST accept the `EntityCardProps` interface defined below:
//    - `entityId` (string): The full HA entity ID (e.g., 'media_player.tv')
//    - `customName` (string?): Optional mapped name from the user
//    - `entityData` (EntityState?): Current state from HA
//    - `onClose` (() => void): Function to close the card modal
//
// 2. Register the Card
//    Scroll down to the `entityRegistry` object below and add a new key 
//    matching your domain (e.g., "media_player").
//    Set `CardComponent` to point to your new component.
//
// 3. Define Pin Click Behavior (Optional)
//    Define what happens when the user clicks the entity pin on the room map.
//    - If you omit `onPinClick`, the default behavior is to open your CardComponent.
//    - If you want a quick action (like toggling a switch or pausing media), 
//      you should construct a custom hook that utilizes the `useHomeAssistant` hook.
//      `useHomeAssistant` provides `sendCommand` (to send actions to HA) and more.
//      Initialize your custom hook at the top of `useEntityRegistry`, and call its methods inside `onPinClick`.
//      Example: `onPinClick: (entityId) => mediaHook.pause(entityId)`
// ============================================================================

export interface EntityCardProps {
    entityId: string;
    customName?: string;
    entityData?: EntityState;
    onClose: () => void;
}

export interface PinClickContext {
    openCard: () => void;
}

export interface EntityRegistryEntry {
    CardComponent: React.ComponentType<EntityCardProps>;
    onPinClick?: (entityId: string, context: PinClickContext) => void;
}

export function useEntityRegistry() {
    const { toggle } = useSwitches();

    const entityRegistry: Record<string, EntityRegistryEntry> = useMemo(() => ({
        "light": {
            CardComponent: EntityLightCard,
            onPinClick: (entityId) => toggle(entityId)
        },
        "switch": {
            CardComponent: EntitySwitchCard,
            onPinClick: (entityId) => toggle(entityId)
        },
        // Add more entities here
        "default": {
            CardComponent: EntityDefaultCard,
            onPinClick: (_, { openCard }) => openCard()
        }
    }), [toggle]);

    const getRegistryEntry = (domain: string): EntityRegistryEntry => {
        return entityRegistry[domain] || entityRegistry["default"];
    };

    return { getRegistryEntry };
}