import { useState } from "react";
import PopupOverlay from "@/shared/components/PopupOverlay";
import { useRooms } from "@/features/rooms/hooks/useRooms";
import type { LightConfig } from "@/features/rooms/types/rooms";
import LightEditorPreview from "@/features/lights/components/LightEditor/LightEditorPreview";
import LightEditorControls from "@/features/lights/components/LightEditor/LightEditorControls";

export default function LightEditor({ imageSrc, entityId, entityData, onClose }: { imageSrc: string, entityId: string, entityData?: any, onClose: () => void }) {
    const { currentRoom, lightMap, setLightMap } = useRooms();

    // Now an array of configs
    const [configs, setConfigs] = useState<LightConfig[]>(
        lightMap.get(entityId) || [{
            type: 'point',
            maxBrightness: 1,
            radius: 50,
            angle: 180,
            spread: 60,
            position: { x: 50, y: 50 }
        }]
    );
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [isSaved, setIsSaved] = useState(false);

    const updateConfig = (index: number, updates: Partial<LightConfig>) => {
        setConfigs(prev => {
            const newConfigs = [...prev];
            newConfigs[index] = { ...newConfigs[index], ...updates };
            return newConfigs;
        });
        setIsSaved(false);
    };

    const addLight = () => {
        setConfigs(prev => [...prev, {
            type: 'point',
            maxBrightness: 1,
            radius: 50,
            angle: 180,
            spread: 60,
            position: { x: 50, y: 50 }
        }]);
        setActiveIndex(configs.length);
        setIsSaved(false);
    };

    const removeLight = (index: number) => {
        if (configs.length === 1) return;
        setConfigs(prev => prev.filter((_, i) => i !== index));
        if (activeIndex >= index) {
            setActiveIndex(Math.max(0, activeIndex - 1));
        }
        setIsSaved(false);
    };

    const handleSave = () => {
        setLightMap(new Map(lightMap).set(entityId, configs));
        setIsSaved(true);
    };

    const activeConfig = configs[activeIndex];

    return (
        <PopupOverlay>
            <div className="light-editor-container m-auto">
                <div className="light-editor-content-wrapper">

                    <LightEditorPreview
                        currentRoom={currentRoom}
                        imageSrc={imageSrc}
                        configs={configs}
                        activeIndex={activeIndex}
                        entityData={entityData}
                        updateConfig={updateConfig}
                        setActiveIndex={setActiveIndex}
                        setIsSaved={setIsSaved}
                    />

                    <LightEditorControls
                        configs={configs}
                        activeIndex={activeIndex}
                        activeConfig={activeConfig}
                        isSaved={isSaved}
                        updateConfig={updateConfig}
                        addLight={addLight}
                        removeLight={removeLight}
                        setActiveIndex={setActiveIndex}
                        onClose={onClose}
                        handleSave={handleSave}
                    />

                </div>
            </div>
        </PopupOverlay>
    );
}
