import { useState, useEffect } from 'react';
import AbstractEntityCard from '@/features/entities/components/AbstractEntityCard';
import { type BaseEntityCardProps } from '@/shared/types/EntityCard';
import useSwitches from '@/features/entities/hooks/useSwitches';
import { useLights } from '@/features/lights/hooks/useLights';
import { getRelativeTime } from '@/shared/utils/time';
import { hexToHsva, hsvaToHex } from '@uiw/color-convert';
import LightStateDisplay from '@/features/lights/components/Light/LightStateDisplay';
import LightControls from '@/features/lights/components/Light/LightControls';
import LightModeSelector from '@/features/lights/components/Light/LightModeSelector';
import LightPresets from '@/features/lights/components/Light/LightPresets';

// Temp Slider Helpers
const minTemp = 2000;
const maxTemp = 6500;

type ControlMode = 'brightness' | 'color' | 'temp';

export default function EntityLightCard({ entityId, customName, entityData, onClose }: BaseEntityCardProps) {
    const displayName = customName || entityData?.attributes.friendly_name || entityId;
    const { toggle } = useSwitches();
    const { setBrightness, setColorTemp, setHsColor } = useLights();

    // Optimistic state holder
    const [optimisticValues, setOptimisticValues] = useState<{
        isOn?: boolean;
        brightness?: number;
        hsColor?: [number, number];
        colorTemp?: number;
    }>({});

    // Reset optimistic state when real update arrives for specific keys
    useEffect(() => {
        // Simple strategy: clear all optimistic values when any state update arrives from HA
        // A more granular approach could be used if flickering occurs, but this usually suffices
        setOptimisticValues({});
    }, [entityData]);

    // Extract state (Optimistic > Real > Default)
    const isOn = optimisticValues.isOn !== undefined ? optimisticValues.isOn : (entityData?.state === 'on');

    const rawBrightness = entityData?.attributes.brightness || 0;
    const brightness = optimisticValues.brightness !== undefined ? optimisticValues.brightness : rawBrightness;
    const brightnessPct = Math.round((brightness / 255) * 100);

    const hsColor = optimisticValues.hsColor !== undefined ? optimisticValues.hsColor : entityData?.attributes.hs_color;
    const colorTemp = optimisticValues.colorTemp !== undefined ? optimisticValues.colorTemp : entityData?.attributes.color_temp_kelvin;

    const [mode, setMode] = useState<ControlMode>('brightness');
    const [timeAgo, setTimeAgo] = useState(getRelativeTime(entityData?.last_updated));

    useEffect(() => {
        if (Object.keys(optimisticValues).length > 0) {
            setTimeAgo('Just now');
            return;
        }
        setTimeAgo(getRelativeTime(entityData?.last_updated));
        const interval = setInterval(() => {
            setTimeAgo(getRelativeTime(entityData?.last_updated));
        }, 60000);
        return () => clearInterval(interval);
    }, [entityData?.last_updated, optimisticValues]);

    // Handlers
    const handlePower = () => {
        setOptimisticValues(prev => ({ ...prev, isOn: !isOn }));
        toggle(entityId);
    };

    const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        // Convert 0-100 to 0-255
        const haVal = Math.round((val / 100) * 255);

        setOptimisticValues(prev => ({ ...prev, brightness: haVal }));
        setBrightness(entityId, haVal);
    };

    const handleColorChange = (hex: string) => {
        const hsva = hexToHsva(hex);
        setOptimisticValues(prev => ({ ...prev, hsColor: [hsva.h, hsva.s] }));
        setHsColor(entityId, hsva.h, hsva.s);
    };

    const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setOptimisticValues(prev => ({ ...prev, colorTemp: val }));
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
