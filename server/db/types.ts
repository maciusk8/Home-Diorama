export interface DbRoom {
    id: string;
    name: string;
    image?: string | null;
    nightImage?: string | null;
    bgColor?: string;
}

export interface DbPin {
    id: string;
    roomId: string;
    typeId: string;
    x: number;
    y: number;
    customName?: string | null;
}

export interface DbLight {
    id: string;
    pinId: string;
    typeId: string;
    maxBrightness: number;
    radius: number;
    angle: number;
    spread: number;
    x: number;
    y: number;
}

export interface DbPinType {
    id: string;
    name: string;
}

export interface DbLightType {
    id: string;
    name: string;
}

export interface DbArea {
    id: string;
    roomPinId: string;
    points: string;
}

export interface DbAreaInput {
    id: string;
    roomPinId: string;
    points: [number, number][];
}
