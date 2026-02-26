import { db } from "./connection";
import type { DbAreaInput } from "./types";

export const insertArea = (area: DbAreaInput) => {
    db.query(`
    INSERT INTO pinAreas (id, roomPinId, points) 
    VALUES ($id, $roomPinId, $points)
  `).run({
        $id: area.id,
        $roomPinId: area.roomPinId,
        $points: JSON.stringify(area.points)
    });
};

export const updateArea = (area: Pick<DbAreaInput, 'id' | 'points'>) => {
    db.query(`
    UPDATE pinAreas SET points = $points WHERE id = $id
  `).run({
        $id: area.id,
        $points: JSON.stringify(area.points)
    });
};

export const removeArea = (id: string) => {
    db.query(`DELETE FROM pinAreas WHERE id = $id`).run({ $id: id });
};

/**
 * Replaces the area for a given pin. 
 * A pin can only have one area, so this deletes any existing area for the pin
 * and then inserts the new points.
 */
export const replaceAreaForPin = (roomPinId: string, points: [number, number][]) => {
    const tx = db.transaction(() => {
        db.query(`DELETE FROM pinAreas WHERE roomPinId = $roomPinId`).run({ $roomPinId: roomPinId });

        if (points.length > 0) {
            db.query(`
                INSERT INTO pinAreas (id, roomPinId, points)
                VALUES ($id, $roomPinId, $points)
            `).run({
                $id: crypto.randomUUID(),
                $roomPinId: roomPinId,
                $points: JSON.stringify(points)
            });
        }
    });
    tx();
};
