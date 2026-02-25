import { db } from "./connection";

export const insertArea = (area: any) => {
    db.query(`
    INSERT INTO pinAreas (id, roomPinId, points) 
    VALUES ($id, $roomPinId, $points)
  `).run({
        $id: area.id,
        $roomPinId: area.roomPinId,
        $points: JSON.stringify(area.points)
    });
};

export const updateArea = (area: any) => {
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
