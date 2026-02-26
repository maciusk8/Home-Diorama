import { useState } from "react";
import PopupOverlay from "@/shared/components/PopupOverlay";
import useCurrentRoom from "@/shared/hooks/useCurrentRoom";
import useLightConfigs from "@/features/lights/hooks/useLightConfigs";
import LightEditorPreview from "@/features/lights/components/LightEditor/LightEditorPreview";
import LightEditorControls from "@/features/lights/components/LightEditor/LightEditorControls";
import './LightEditor.css';

export default function LightEditor({ imageSrc, entityId, entityData, onClose }: { imageSrc: string, entityId: string, entityData?: any, onClose: () => void }) {
    const { room: currentRoom } = useCurrentRoom();
    const lightConfigs = useLightConfigs(entityId);
    const [isNightView, setIsNightView] = useState(false);

    const hasNightImage = !!currentRoom?.nightImage;
    const displayImage = (isNightView && currentRoom?.nightImage) ? currentRoom.nightImage : imageSrc;

    return (
        <PopupOverlay>
            <div className="light-editor-container m-auto">
                <div className="light-editor-content-wrapper">

                    <LightEditorPreview
                        imageSrc={displayImage}
                        configs={lightConfigs.configs}
                        activeIndex={lightConfigs.activeIndex}
                        entityData={entityData}
                        updateConfig={lightConfigs.updateConfig}
                        setActiveIndex={lightConfigs.setActiveIndex}
                        setIsSaved={lightConfigs.setIsSaved}
                    />

                    <LightEditorControls
                        configs={lightConfigs.configs}
                        activeIndex={lightConfigs.activeIndex}
                        activeConfig={lightConfigs.activeConfig}
                        isSaved={lightConfigs.isSaved}
                        isNightView={isNightView}
                        hasNightImage={hasNightImage}
                        updateConfig={lightConfigs.updateConfig}
                        addLight={lightConfigs.addLight}
                        removeLight={lightConfigs.removeLight}
                        setActiveIndex={lightConfigs.setActiveIndex}
                        toggleNightView={() => setIsNightView(prev => !prev)}
                        onClose={onClose}
                        handleSave={lightConfigs.save}
                    />

                </div>
            </div>
        </PopupOverlay>
    );
}
