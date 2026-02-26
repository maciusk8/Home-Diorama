import { Database } from "bun:sqlite";

export const db = new Database("ha_dashboard.sqlite");
db.query("PRAGMA foreign_keys = ON;").run();

export const getRoomsData = () => {
    const rooms = db.query(`SELECT * FROM rooms`).all();
    const pins = db.query(`SELECT * FROM roomPins`).all();
    const lights = db.query(`SELECT * FROM entityLights`).all();
    const areas = db.query(`SELECT * FROM pinAreas`).all();

    return { rooms, pins, lights, areas };
};

export const getRoomById = (id: string) => {
    return db.query(`SELECT * FROM rooms WHERE id = $id`).get({ $id: id });
};

export const insertRoom = (room: any) => {
    db.query(`
    INSERT INTO rooms (id, name, image, nightImage, bgColor) 
    VALUES ($id, $name, $image, $nightImage, $bgColor)
  `).run({
        $id: room.id,
        $name: room.name,
        $image: room.image || null,
        $nightImage: room.nightImage || null,
        $bgColor: room.bgColor || 'transparent'
    });
};

export const insertPin = (pin: any) => {
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

export const updatePinPosition = (id: string, x: number, y: number) => {
    db.query(`UPDATE roomPins SET x = $x, y = $y WHERE id = $id`).run({ $id: id, $x: x, $y: y });
};

export const removePin = (id: string) => {
    db.query(`DELETE FROM roomPins WHERE id = $id`).run({ $id: id });
};

export const insertLight = (light: any) => {
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

export const updateLight = (light: any) => {
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

