import { db } from "./connection";
import type { DbRoom } from "./types";

export const getRoomsData = () => {
    const rooms = db.query(`SELECT * FROM rooms ORDER BY rowid`).all();
    const pins = db.query(`SELECT * FROM roomPins`).all();
    const lights = db.query(`SELECT * FROM entityLights`).all();
    const areas = db.query(`SELECT * FROM pinAreas`).all();
    const lightTypes = db.query(`SELECT * FROM lightTypes`).all();

    return { rooms, pins, lights, areas, lightTypes };
};

export const getRoomById = (id: string) => {
    return db.query(`SELECT * FROM rooms WHERE id = $id`).get({ $id: id });
};

export const insertRoom = (room: DbRoom) => {
    db.query(`
    INSERT INTO rooms (id, name, image, nightImage, bgColor) 
    VALUES ($id, $name, $image, $nightImage, $bgColor)
  `).run({
        $id: room.id,
        $name: room.name,
        $image: room.image || null,
        $nightImage: room.nightImage || null,
        $bgColor: room.bgColor || '#ffffff'
    });
};

export const updateRoom = (room: DbRoom) => {
    db.query(`
    UPDATE rooms SET 
      name = $name, 
      image = $image, 
      nightImage = $nightImage, 
      bgColor = $bgColor 
    WHERE id = $id
  `).run({
        $id: room.id,
        $name: room.name,
        $image: room.image || null,
        $nightImage: room.nightImage || null,
        $bgColor: room.bgColor || '#ffffff'
    });
};

export const removeRoom = (id: string) => {
    db.query(`DELETE FROM rooms WHERE id = $id`).run({ $id: id });
};

