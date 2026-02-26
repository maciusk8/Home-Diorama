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
