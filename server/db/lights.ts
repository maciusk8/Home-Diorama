import { db } from "./connection";
import type { DbLight } from "./types";

export const insertLight = (light: DbLight) => {
  db.query(`
    INSERT INTO entityLights (id, pinId, typeId, maxBrightness, radius, angle, spread, x, y)
    VALUES ($id, $pinId, $typeId, $maxBrightness, $radius, $angle, $spread, $x, $y)
  `).run({
    $id: light.id,
    $pinId: light.pinId,
    $typeId: light.typeId,
    $maxBrightness: light.maxBrightness,
    $radius: light.radius,
    $angle: light.angle,
    $spread: light.spread,
    $x: light.x,
    $y: light.y
  });
};

export const updateLight = (light: Omit<DbLight, 'pinId'>) => {
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

/**
 * Replaces all lights for a given pin.
 * Deletes existing lights for the pin, then inserts new ones.
 */
export const replaceLightsForPin = (pinId: string, lights: Omit<DbLight, 'id' | 'pinId'>[]) => {
  const tx = db.transaction(() => {
    db.query(`DELETE FROM entityLights WHERE pinId = $pinId`)
      .run({ $pinId: pinId });

    for (const light of lights) {
      db.query(`
        INSERT INTO entityLights (id, pinId, typeId, maxBrightness, radius, angle, spread, x, y)
        VALUES ($id, $pinId, $typeId, $maxBrightness, $radius, $angle, $spread, $x, $y)
      `).run({
        $id: crypto.randomUUID(),
        $pinId: pinId,
        $typeId: light.typeId,
        $maxBrightness: light.maxBrightness,
        $radius: light.radius,
        $angle: light.angle,
        $spread: light.spread,
        $x: light.x,
        $y: light.y,
      });
    }
  });
  tx();
};
