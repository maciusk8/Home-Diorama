import { useState } from 'react';
import Wheel from '@uiw/react-color-wheel';
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';
import Icon from '@mdi/react';
import { mdiPalette } from '@mdi/js';
import type { HsvaColor } from '@uiw/color-convert';

//vibe coded so it might be a bit rough, but it works and looks nice so who cares

interface WheelPaletteProps {
    currentColor?: string;
    onColorChange: (color: string) => void;
}

const DEFAULT_HSVA: HsvaColor = { h: 0, s: 0, v: 100, a: 1 };

export default function WheelPalette({ currentColor, onColorChange }: WheelPaletteProps) {
    const [isOpen, setOpen] = useState(false);
    const [hsva, setHsva] = useState<HsvaColor>(
        currentColor ? hexToHsva(currentColor) : DEFAULT_HSVA
    );

    const handleChange = (color: { hsva: HsvaColor }) => {
        setHsva(color.hsva);
        onColorChange(hsvaToHex(color.hsva));
    };

    const clearColor = () => {
        setHsva(DEFAULT_HSVA);
        onColorChange('');
        setOpen(false);
    };

    const handleHexInput = (value: string) => {
        const hex = value.startsWith('#') ? value : `#${value}`;
        if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
            const newHsva = hexToHsva(hex);
            setHsva(newHsva);
            onColorChange(hex);
        }
    };

    return (
        <>
            <button
                className="wheel-palette-fab"
                onClick={() => setOpen(true)}
                title="Change background color"
            >
                <Icon path={mdiPalette} size={1.2} />
            </button>

            {isOpen && (
                <div className="wheel-palette-overlay" onClick={() => setOpen(false)}>
                    <div className="wheel-palette-popup" onClick={(e) => e.stopPropagation()}>
                        <Wheel
                            color={hsva}
                            onChange={handleChange}
                            width={220}
                            height={220}
                        />
                        <div className="wheel-palette-brightness">
                            <label className="wheel-palette-brightness-label">Brightness</label>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={hsva.v}
                                className="wheel-palette-brightness-slider"
                                style={{
                                    background: `linear-gradient(to right, #000, hsl(${hsva.h}, ${hsva.s}%, 50%))`
                                }}
                                onChange={(e) => {
                                    const newHsva = { ...hsva, v: Number(e.target.value) };
                                    setHsva(newHsva);
                                    onColorChange(hsvaToHex(newHsva));
                                }}
                            />
                        </div>
                        <div
                            className="wheel-palette-preview"
                            style={{ backgroundColor: hsvaToHex(hsva) }}
                        />
                        <input
                            className="wheel-palette-hex-input"
                            value={hsvaToHex(hsva)}
                            onChange={(e) => handleHexInput(e.target.value)}
                            spellCheck={false}
                        />
                        <div className="wheel-palette-actions">
                            <button className="wheel-palette-btn" onClick={clearColor}>
                                Clear
                            </button>
                            <button className="wheel-palette-btn wheel-palette-btn-done" onClick={() => setOpen(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
