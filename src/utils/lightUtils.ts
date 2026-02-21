import type { LightConfig } from "../types/rooms";

export function getLightStyle(config: LightConfig, entityData: any, isEditor: boolean = false): React.CSSProperties {
    const { type, radius, angle, spread, position, maxBrightness } = config;

    let r = 255, g = 255, b = 255;
    const attrs = entityData?.attributes || {};
    if (attrs.rgb_color) {
        [r, g, b] = attrs.rgb_color;
    } else if (attrs.color_temp) {
        r = 255; g = 240; b = 220; // fallback warm color
    }

    const state = entityData?.state;
    // HA brightness is 0-255. Default to 255 (1.0) if not provided.
    const haBrightness = attrs.brightness ? attrs.brightness / 255 : 1;

    let targetAlpha = 0;

    if (isEditor) {
        // In editor, we want to see the configuration clearly.
        // If the light is visually 'off' in HA, mock it as 'on' at 100% HA brightness so we can preview the shape.
        const baseBright = state === 'on' ? haBrightness : 1;
        targetAlpha = baseBright * maxBrightness;
    } else {
        if (state === 'on') {
            targetAlpha = haBrightness * maxBrightness;
        } else {
            targetAlpha = 0;
        }
    }

    if (targetAlpha === 0) {
        return { display: 'none' };
    }

    // Clamp the inner alpha to 1.0 since rgba doesn't support values > 1
    const centerAlpha = Math.min(1.0, targetAlpha);
    const rgbaCenter = `rgba(${r}, ${g}, ${b}, ${centerAlpha})`;
    const px = position.x;
    const py = position.y;

    // To simulate 'much more power' for brightness > 1, we stack gradients
    // in screen mode. This increases the brightness of the falloff area (bloom).
    const gradientCount = Math.ceil(Math.min(5, targetAlpha));

    if (type === 'point') {
        const innerRadius = (radius * spread) / 100;
        const grad = `radial-gradient(circle at ${px}% ${py}%, ${rgbaCenter} ${innerRadius}%, transparent ${radius}%)`;

        return {
            background: Array(gradientCount).fill(grad).join(', '),
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0, zIndex: 1
        };
    } else {
        const grad = `radial-gradient(circle at ${px}% ${py}%, ${rgbaCenter} 0%, transparent ${radius}%)`;

        return {
            background: Array(gradientCount).fill(grad).join(', '),
            maskImage: `conic-gradient(from ${angle - spread / 2}deg at ${px}% ${py}%, transparent 0deg, black 10deg, black ${spread - 10}deg, transparent ${spread}deg)`,
            WebkitMaskImage: `conic-gradient(from ${angle - spread / 2}deg at ${px}% ${py}%, transparent 0deg, black 10deg, black ${spread - 10}deg, transparent ${spread}deg)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0, zIndex: 1
        };
    }
}
