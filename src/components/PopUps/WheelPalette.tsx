import { useState } from 'react';
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';
import Icon from '@mdi/react';
import { mdiPalette } from '@mdi/js';
import type { HsvaColor } from '@uiw/color-convert';
import PopupOverlay from './PopupOverlay';
import ColorControl from '../Shared/ColorControl';

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

    const clearColor = () => {
        setHsva(DEFAULT_HSVA);
        onColorChange('');
        setOpen(false);
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
                <PopupOverlay onClose={() => setOpen(false)}>
                    <div className="entity-card" onClick={(e) => e.stopPropagation()}>
                        <h3 className="entity-card-title" style={{ marginBottom: '1rem' }}>Background Color</h3>
                        <ColorControl
                            color={hsvaToHex(hsva)}
                            onChange={(hex) => { 
                                setHsva(hexToHsva(hex));
                                onColorChange(hex); 
                            }}
                        />
                        <div className="wheel-palette-footer">
                            <button className="wheel-palette-btn" onClick={clearColor}>
                                Clear
                            </button>
                            <button className="wheel-palette-btn wheel-palette-btn-done" onClick={() => setOpen(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                </PopupOverlay>
            )}
        </>
    );
}
