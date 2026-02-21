import { useState, useEffect } from 'react';
import ColorControl from '@/shared/components/ColorControl';
import './LightControls.css';

type ControlMode = 'brightness' | 'color' | 'temp';

interface LightControlsProps {
    mode: ControlMode;
    isOn: boolean;
    brightnessPct: number;
    currentColorHex: string;
    currentTemp: number;
    tempPct: number;
    minTemp: number;
    maxTemp: number;
    onBrightnessChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onColorChange: (hex: string) => void;
    onTempChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LightControls({
    mode,
    isOn,
    brightnessPct,
    currentColorHex,
    currentTemp,
    minTemp,
    maxTemp,
    onBrightnessChange,
    onColorChange,
    onTempChange
}: LightControlsProps) {

    const [localBrightness, setLocalBrightness] = useState(brightnessPct);
    const [localTemp, setLocalTemp] = useState(currentTemp);
    const [isDragging, setIsDragging] = useState(false);


    useEffect(() => {
        if (!isDragging) {
            setLocalBrightness(brightnessPct);
        }
    }, [brightnessPct, isDragging]);

    useEffect(() => {
        if (!isDragging) {
            setLocalTemp(currentTemp);
        }
    }, [currentTemp, isDragging]);

    const handleBrightnessInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDragging(true);
        setLocalBrightness(Number(e.target.value));
    };

    const handleBrightnessCommit = () => {
        setIsDragging(false);
        const syntheticEvent = {
            target: { value: localBrightness.toString() }
        } as React.ChangeEvent<HTMLInputElement>;
        onBrightnessChange(syntheticEvent);
    };

    const handleTempInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDragging(true);
        setLocalTemp(Number(e.target.value));
    };

    const handleTempCommit = () => {
        setIsDragging(false);
        const syntheticEvent = {
            target: { value: localTemp.toString() }
        } as React.ChangeEvent<HTMLInputElement>;
        onTempChange(syntheticEvent);
    };

    const localTempPct = 100 - ((localTemp - minTemp) / (maxTemp - minTemp)) * 100;

    return (
        <div className="light-control-area">
            {mode === 'brightness' && (
                <div className="slider-wrapper">
                    <div className="slider-container brightness-slider">

                        <div
                            className="temp-value-bubble temp-value-bubble-translate"
                            style={{ bottom: `${localBrightness}%` }}
                        >
                            {localBrightness}%
                        </div>

                        <div
                            className="slider-fill"
                            style={{
                                height: `${localBrightness}%`,
                                background: isOn ? currentColorHex : '#333'
                            }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={localBrightness}
                            onChange={handleBrightnessInput}
                            onMouseUp={handleBrightnessCommit}
                            onTouchEnd={handleBrightnessCommit}
                            className="slider-input"
                        />
                        <div
                            className="slider-handle slider-handle-translate"
                            style={{ bottom: `${localBrightness}%` }}
                        />
                    </div>
                </div>
            )}

            {mode === 'color' && (
                <ColorControl
                    color={currentColorHex}
                    onChange={onColorChange}
                    showBrightness={false}
                />
            )}

            {mode === 'temp' && (
                <div className="slider-wrapper">
                    <div className="slider-container temp-slider">
                        <div
                            className="temp-value-bubble"
                            style={{ top: `${localTempPct}%` }}
                        >
                            {localTemp} K
                        </div>

                        <div className="slider-track-mask">
                            <div className="slider-gradient-bg" />
                        </div>

                        <input
                            type="range"
                            min={minTemp}
                            max={maxTemp}
                            value={localTemp}
                            onChange={handleTempInput}
                            onMouseUp={handleTempCommit}
                            onTouchEnd={handleTempCommit}
                            className="slider-input"
                        />
                        <div
                            className="slider-handle temp"
                            style={{ top: `${localTempPct}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
