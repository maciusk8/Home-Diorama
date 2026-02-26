import { db } from "./connection";
import type { DbLight } from "./types";

export const insertLight = (light: DbLight) => {
    db.query(`
    INSERT INTO entityLights (id, roomId, typeId, maxBrightness, radius, angle, spread, x, y)
    VALUES ($id, $roomId, $typeId, $maxBrightness, $radius, $angle, $spread, $x, $y)
  `).run({
        $id: light.id,
        $roomId: light.roomId,
        $typeId: light.typeId,
        $maxBrightness: light.maxBrightness,
        $radius: light.radius,
        $angle: light.angle,
        $spread: light.spread,
        $x: light.x,
        $y: light.y
    });
};

export const updateLight = (light: DbLight) => {
    db.query(`
    UPDATE entityLights SET 
      typeId = $typeId, 
      maxBrightness = $maxBrightness, 
      radius = $radius, 
      angle = $angle, 
      spread = $spread, 
      x = $x, 
      y = $y 
    WHERE id = $id
  `).run({
        $id: light.id,
        $typeId: light.typeId,
        $maxBrightness: light.maxBrightness,
        $radius: light.radius,
        $angle: light.angle,
        $spread: light.spread,
        $x: light.x,
        $y: light.y
    });
};

export const removeLight = (id: string) => {
    db.query(`DELETE FROM entityLights WHERE id = $id`).run({ $id: id });
};
