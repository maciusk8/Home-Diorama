import { Button, Form, Dropdown } from "react-bootstrap";
import Icon from '@mdi/react';
import { mdiTrashCanOutline, mdiPlus } from '@mdi/js';
import type { LightConfig } from "@/features/rooms/types/rooms";

interface LightEditorControlsProps {
    configs: LightConfig[];
    activeIndex: number;
    activeConfig: LightConfig;
    isSaved: boolean;
    updateConfig: (index: number, updates: Partial<LightConfig>) => void;
    addLight: () => void;
    removeLight: (index: number) => void;
    setActiveIndex: (index: number) => void;
    onClose: () => void;
    handleSave: () => void;
}

export default function LightEditorControls({
    configs,
    activeIndex,
    activeConfig,
    isSaved,
    updateConfig,
    addLight,
    removeLight,
    setActiveIndex,
    onClose,
    handleSave
}: LightEditorControlsProps) {

    return (
        <div className="light-editor-controls-wrapper">
            <div className="light-editor-controls-layout">

                {/* Left: Light Selection */}
                <div className="light-editor-controls-left">
                    <Dropdown>
                        <Dropdown.Toggle variant="dark" size="sm" className="light-editor-controls-dropdown-toggle">
                            {activeConfig.type === 'point' ? 'Point Light' : 'Directional Light'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu variant="dark">
                            {configs.map((_, i) => (
                                <Dropdown.Item key={i} active={i === activeIndex} onClick={() => setActiveIndex(i)}>
                                    Select Light {i + 1}
                                </Dropdown.Item>
                            ))}
                            <Dropdown.Divider />
                            <Dropdown.Item className="text-secondary" onClick={() => updateConfig(activeIndex, { type: activeConfig.type === 'point' ? 'directional' : 'point' })}>
                                Switch to {activeConfig.type === 'point' ? 'Directional' : 'Point'}
                            </Dropdown.Item>
                            <Dropdown.Item className="text-success" onClick={addLight}>
                                <Icon path={mdiPlus} size={0.7} className="me-2" /> Add New Light
                            </Dropdown.Item>
                            {configs.length > 1 && (
                                <Dropdown.Item className="text-danger" onClick={() => removeLight(activeIndex)}>
                                    <Icon path={mdiTrashCanOutline} size={0.7} className="me-2" /> Delete Current
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                {/* Center: Sliders */}
                <div className="light-editor-controls-center">
                    <div className="light-editor-slider-wrapper">
                        <Form.Label className="mb-0 text-light opacity-75 d-flex justify-content-between light-editor-slider-label">
                            <span>Max Bright</span> <span>{Math.round(activeConfig.maxBrightness * 100)}%</span>
                        </Form.Label>
                        <Form.Range min={0.1} max={5} step={0.1} value={activeConfig.maxBrightness} onChange={(e) => updateConfig(activeIndex, { maxBrightness: parseFloat(e.target.value) })} />
                    </div>
                    <div className="light-editor-slider-wrapper">
                        <Form.Label className="mb-0 text-light opacity-75 d-flex justify-content-between light-editor-slider-label">
                            <span>Radius</span> <span>{activeConfig.radius}%</span>
                        </Form.Label>
                        <Form.Range min={1} max={200} step={1} value={activeConfig.radius} onChange={(e) => updateConfig(activeIndex, { radius: parseInt(e.target.value) })} />
                    </div>
                    <div className="light-editor-slider-wrapper">
                        <Form.Label className="mb-0 text-light opacity-75 d-flex justify-content-between light-editor-slider-label">
                            <span>Spread</span> <span>{activeConfig.spread}{activeConfig.type === 'point' ? '%' : '°'}</span>
                        </Form.Label>
                        <Form.Range min={activeConfig.type === 'point' ? 0 : 10} max={activeConfig.type === 'point' ? 100 : 180} step={activeConfig.type === 'point' ? 1 : 5} value={activeConfig.spread} onChange={(e) => updateConfig(activeIndex, { spread: parseInt(e.target.value) })} />
                    </div>
                    <div className="light-editor-slider-wrapper" style={{ visibility: activeConfig.type === 'directional' ? 'visible' : 'hidden' }}>
                        <Form.Label className="mb-0 text-light opacity-75 d-flex justify-content-between light-editor-slider-label">
                            <span>Angle</span> <span>{activeConfig.angle}°</span>
                        </Form.Label>
                        <Form.Range min={0} max={360} step={5} value={activeConfig.angle} onChange={(e) => updateConfig(activeIndex, { angle: parseInt(e.target.value) })} />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="light-editor-controls-right">
                    <Button variant="secondary" size="sm" onClick={onClose} className="light-editor-controls-btn-close">Close</Button>
                    <Button variant={isSaved ? "success" : "primary"} size="sm" onClick={handleSave} className="light-editor-controls-btn-save">
                        {isSaved ? "Saved!" : "Save"}
                    </Button>
                </div>

            </div>
        </div>
    );
}
