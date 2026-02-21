interface LightPresetsProps {
    onColorChange: (hex: string) => void;
}

export default function LightPresets({ onColorChange }: LightPresetsProps) {
    const presets = [
        '#ff9800', '#ffc107', '#ffeb3b', '#ffffff',
        '#90caf9', '#ce93d8', '#f48fb1', '#ff7043',
    ];

    return (
        <div className="presets-grid">
            {presets.map((preset) => (
                <button
                    key={preset}
                    onClick={() => onColorChange(preset)}
                    className="preset-btn"
                    style={{ background: preset }}
                />
            ))}
        </div>
    );
}
