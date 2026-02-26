import { db } from "./connection";
import type { DbPin } from "./types";

export const insertPin = (pin: DbPin) => {
    db.query(`
    INSERT INTO roomPins (id, roomId, typeId, x, y, customName)
    VALUES ($id, $roomId, $typeId, $x, $y, $customName)
  `).run({
        $id: pin.id,
        $roomId: pin.roomId,
        $typeId: pin.typeId,
        $x: pin.x,
        $y: pin.y,
        $customName: pin.customName || null
    });
};

export const getPinsByType = (typeId: string) => {
    return db.query(`SELECT * FROM roomPins WHERE typeId = $typeId`).all({ $typeId: typeId });
};

export const updatePin = (pin: DbPin) => {
    db.query(`
    UPDATE roomPins SET 
      roomId = $roomId, 
      typeId = $typeId, 
      x = $x, 
      y = $y, 
      customName = $customName 
    WHERE id = $id
  `).run({
        $id: pin.id,
        $roomId: pin.roomId,
        $typeId: pin.typeId,
        $x: pin.x,
        $y: pin.y,
        $customName: pin.customName || null
    });
};

export const updatePinPosition = (id: string, x: number, y: number) => {
    db.query(`UPDATE roomPins SET x = $x, y = $y WHERE id = $id`).run({ $id: id, $x: x, $y: y });
};

export const removePin = (id: string) => {
    db.query(`DELETE FROM roomPins WHERE id = $id`).run({ $id: id });
};
