import { useState, useEffect, useRef } from 'react';
import Wheel from '@uiw/react-color-wheel';
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';
import type { HsvaColor } from '@uiw/color-convert';

interface ColorControlProps {
    color?: string;
    onChange: (color: string) => void;
    showBrightness?: boolean;
}

const DEFAULT_HSVA: HsvaColor = { h: 0, s: 0, v: 100, a: 1 };

export default function ColorControl({ color, onChange, showBrightness = true }: ColorControlProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const [hsva, setHsva] = useState<HsvaColor>(
        color ? hexToHsva(color) : DEFAULT_HSVA
    );

    const [hexInput, setHexInput] = useState(color || '#ffffff');

    // Sync internal state if prop changes externally (e.g. presets)
    // BUT only if user is not focused on the input
    useEffect(() => {
        if (color) {
            setHsva(hexToHsva(color));
            if (!isFocused) {
                setHexInput(color);
            }
        }
    }, [color, isFocused]);

    const handleColorChange = (newColor: HsvaColor) => {
        setHsva(newColor);
        const hex = hsvaToHex(newColor);
        setHexInput(hex);
        onChange(hex);
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHexInput(val);
        // If valid hex, update the actual color
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            const newHsva = hexToHsva(val);
            setHsva(newHsva);
            onChange(val);
        }
    };

    return (
        <div
            className="color-control-container"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}
        >
            <div style={{ position: 'relative' }}>
                <Wheel
                    color={hsva}
                    onChange={(newColor) => handleColorChange(newColor.hsva)}
                    width={200}
                    height={200}
                />
            </div>

            {showBrightness && (
                <div className="wheel-palette-brightness">
                    <span className="wheel-palette-brightness-label">Brightness</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={hsva.v}
                        onChange={(e) => {
                            const newV = Number(e.target.value);
                            handleColorChange({ ...hsva, v: newV });
                        }}
                        style={{ width: '100%' }}
                    />
                </div>
            )}

            <div className="wheel-palette-hex-row">
                <div className="wheel-palette-preview" style={{ background: hsvaToHex(hsva) }} />
                <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        // Validate on blur and reset if invalid?
                        // For now let's just ensure we sync up with prop if we were in invalid state
                        if (color && color !== hexInput) {
                            // If invalid hex left, revert to actual color
                            if (!/^#[0-9A-F]{6}$/i.test(hexInput)) {
                                setHexInput(color);
                            }
                        }
                    }}
                    className="wheel-palette-hex-input"
                    maxLength={7}
                    placeholder="#RRGGBB"
                />
            </div>
        </div>
    );
}
