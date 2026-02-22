export type Room = {
  name: string;
  image: string | null;
  nightImage: string | null;
  bgColor: string;
  entities: Entity[];
}

export type Entity = {
  id: string;
  x: number;    // %        
  y: number;    // %
  customName?: string;
};

export type LightConfig = {
  type: 'point' | 'directional';
  maxBrightness: number; // 0 to 1
  radius: number; // in % relative to image
  angle: number; // 0 to 360 deg
  spread: number; // 0 to 360 deg
  position: { x: number, y: number }; // in % relative to image
};