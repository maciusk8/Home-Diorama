import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCurrentRoom from '@/shared/hooks/useCurrentRoom';
import type { LightConfig } from '@/features/rooms/types/rooms';

const DEFAULT_CONFIG: LightConfig = {
    type: 'point',
    maxBrightness: 1,
    radius: 50,
    angle: 180,
    spread: 60,
    position: { x: 50, y: 50 },
};

/**
 * Manages light config state and persistence for a given entity.
 * Extracts config CRUD logic from LightEditor component.
 */
export default function useLightConfigs(entityId: string) {
    const { lights, lightTypeMap } = useCurrentRoom();
    const queryClient = useQueryClient();

    // Build initial configs from DB lights for this pin (entityId = pinId)
    const existingConfigs: LightConfig[] = lights
        .filter(l => l.pinId === entityId)
        .map(l => {
            const typeName = lightTypeMap.byId.get(l.typeId) ?? 'Point Light';
            return {
                type: (typeName === 'Point Light' ? 'point' : 'directional') as 'point' | 'directional',
                maxBrightness: l.maxBrightness,
                radius: l.radius,
                angle: l.angle,
                spread: l.spread,
                position: { x: l.x, y: l.y },
            };
        });

    const [configs, setConfigs] = useState<LightConfig[]>(
        existingConfigs.length > 0 ? existingConfigs : [DEFAULT_CONFIG]
    );
    const [activeIndex, setActiveIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const saveMutation = useMutation({
        mutationFn: (lightConfigs: LightConfig[]) =>
            fetch(`/api/local/lights/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pinId: entityId,
                    configs: lightConfigs.map(c => {
                        const typeUuid = lightTypeMap.byName.get(c.type === 'point' ? 'Point Light' : 'Directional Light') ?? '';
                        return {
                            typeId: typeUuid,
                            maxBrightness: c.maxBrightness,
                            radius: c.radius,
                            angle: c.angle,
                            spread: c.spread,
                            x: c.position.x,
                            y: c.position.y,
                        };
                    }),
                }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homeData'] }),
    });

    const updateConfig = (index: number, updates: Partial<LightConfig>) => {
        setConfigs(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], ...updates };
            return updated;
        });
        setIsSaved(false);
    };

    const addLight = () => {
        setConfigs(prev => [...prev, DEFAULT_CONFIG]);
        setActiveIndex(configs.length);
        setIsSaved(false);
    };

    const removeLight = (index: number) => {
        if (configs.length === 1) return;
        setConfigs(prev => prev.filter((_, i) => i !== index));
        if (activeIndex >= index) setActiveIndex(Math.max(0, activeIndex - 1));
        setIsSaved(false);
    };

    const save = () => {
        saveMutation.mutate(configs);
        setIsSaved(true);
    };

    return {
        configs,
        activeIndex,
        activeConfig: configs[activeIndex],
        isSaved,
        setActiveIndex,
        setIsSaved,
        updateConfig,
        addLight,
        removeLight,
        save,
    };
}
