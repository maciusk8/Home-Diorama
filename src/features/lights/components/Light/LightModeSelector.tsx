import Icon from '@mdi/react';
import { mdiPower, mdiBrightness6, mdiPalette, mdiThermometer } from '@mdi/js';

type ControlMode = 'brightness' | 'color' | 'temp';

interface LightModeSelectorProps {
    mode: ControlMode;
    setMode: (mode: ControlMode) => void;
    isOn: boolean;
    onPowerToggle: () => void;
}

export default function LightModeSelector({ mode, setMode, isOn, onPowerToggle }: LightModeSelectorProps) {
    const getIconColor = (isActive: boolean) => isActive ? '#000000' : '#ffffff';
 
    return (
        <div className="light-mode-actions">
            <button
                onClick={onPowerToggle}
                title="Toggle Power"
                className={`mode-btn ${isOn ? 'active' : 'inactive'}`}
            >
                <Icon path={mdiPower} color={getIconColor(isOn)} />
            </button>
            <div className="mode-separator" />
            <button
                onClick={() => setMode('brightness')}
                title="Brightness"
                className={`mode-btn ${mode === 'brightness' ? 'active' : 'inactive'}`}
            >
                <Icon path={mdiBrightness6} color={getIconColor(mode === 'brightness')} />
            </button>
            <button
                onClick={() => setMode('color')}
                title="Color"
                className={`mode-btn ${mode === 'color' ? 'active' : 'inactive'}`}
            >
                <Icon path={mdiPalette} color={getIconColor(mode === 'color')} />
            </button>
            <button
                onClick={() => setMode('temp')}
                title="Temperature"
                className={`mode-btn ${mode === 'temp' ? 'active' : 'inactive'}`}
            >
                <Icon path={mdiThermometer} color={getIconColor(mode === 'temp')} />
            </button>
        </div>
    );
}
