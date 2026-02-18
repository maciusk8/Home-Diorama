import { useState, useEffect } from 'react';
import AbstractEntityCard from './AbstractEntityCard';
import { type BaseEntityCardProps } from '../../types/EntityCard';
import { useLights } from '../../hooks/Entities/useLights';
import { getRelativeTime } from '../../utils/time';
import { hexToHsva, hsvaToHex } from '@uiw/color-convert';
import LightStateDisplay from './Light/LightStateDisplay';
import LightControls from './Light/LightControls';
import LightModeSelector from './Light/LightModeSelector';
import LightPresets from './Light/LightPresets';

// Temp Slider Helpers
const minTemp = 2000;
const maxTemp = 6500;

type ControlMode = 'brightness' | 'color' | 'temp';

export default function EntityLightCard({ entityId, customName, entityData, onClose }: BaseEntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;
    const { toggle, setBrightness, setColorTemp, setHsColor } = useLights();

    // Extract state
    const isOn = entityData?.state === 'on';
    const brightness = entityData?.attributes.brightness || 0; // 0-255
    const brightnessPct = Math.round((brightness / 255) * 100);
    const hsColor = entityData?.attributes.hs_color; // [h, s]
    const colorTemp = entityData?.attributes.color_temp_kelvin; // Kelvin

    const [mode, setMode] = useState<ControlMode>('brightness');
    const [timeAgo, setTimeAgo] = useState(getRelativeTime(entityData?.last_updated));

    useEffect(() => {
        setTimeAgo(getRelativeTime(entityData?.last_updated));
        const interval = setInterval(() => {
            setTimeAgo(getRelativeTime(entityData?.last_updated));
        }, 60000);
        return () => clearInterval(interval);
    }, [entityData?.last_updated]);

    // Handlers
    const handlePower = () => toggle(entityId);

    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        // Convert 0-100 to 0-255
        const haVal = Math.round((val / 100) * 255);
        setBrightness(entityId, haVal);
    };

    const handleColorChange = (hex: string) => {
        const hsva = hexToHsva(hex);
        setHsColor(entityId, hsva.h, hsva.s);
    };

    const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setColorTemp(entityId, val);
    };

    // Calculate current color for the slider preview
    let currentColorHex = '#ffffff';
    if (hsColor) {
        currentColorHex = hsvaToHex({ h: hsColor[0], s: hsColor[1], v: 100, a: 1 });
    }

    const currentTemp = colorTemp || 2700;
    const tempPct = 100 - ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100;

    return (
        <AbstractEntityCard onClose={onClose}>
            <AbstractEntityCard.Header name={displayName} />
            <AbstractEntityCard.Body>
                <div className="light-card-body">

                    <LightStateDisplay
                        brightnessPct={brightnessPct}
                        timeAgo={timeAgo}
                    />

                    <LightControls
                        mode={mode}
                        isOn={isOn}
                        brightnessPct={brightnessPct}
                        currentColorHex={currentColorHex}
                        currentTemp={currentTemp}
                        tempPct={tempPct}
                        minTemp={minTemp}
                        maxTemp={maxTemp}
                        onBrightnessChange={handleBrightnessChange}
                        onColorChange={handleColorChange}
                        onTempChange={handleTempChange}
                    />

                    <LightModeSelector
                        mode={mode}
                        setMode={setMode}
                        isOn={isOn}
                        onPowerToggle={handlePower}
                    />

                    <LightPresets onColorChange={handleColorChange} />

                </div>
            </AbstractEntityCard.Body>
        </AbstractEntityCard>
    );
}
