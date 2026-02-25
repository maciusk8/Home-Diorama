import { Database } from "bun:sqlite";

const db = new Database("ha_dashboard.sqlite");

db.query("PRAGMA foreign_keys = ON;").run();

console.log("Initializing database...");

const initScript = db.transaction(() => {

  //rooms
  db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      nightImage TEXT,
      bgColor TEXT DEFAULT 'transparent'
    );
  `).run();

  //room pins
  db.query(`
    CREATE TABLE IF NOT EXISTS roomPins (
      id TEXT PRIMARY KEY,
      roomId TEXT NOT NULL,
      typeId TEXT NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      customName TEXT,
      FOREIGN KEY(roomId) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY(typeId) REFERENCES pinTypes(id) ON DELETE CASCADE
    );
  `).run();

  //lights
  db.query(`
    CREATE TABLE IF NOT EXISTS entityLights (
      id TEXT PRIMARY KEY,
      roomId TEXT NOT NULL,
      typeId TEXT NOT NULL, 
      maxBrightness REAL NOT NULL,
      radius REAL NOT NULL,
      angle REAL NOT NULL,
      spread REAL NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      FOREIGN KEY(roomId) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY(typeId) REFERENCES pinTypes(id) ON DELETE CASCADE
    );
  `).run();

  //entity types
  db.query(`
    CREATE TABLE IF NOT EXISTS pinTypes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    INSERT INTO pinTypes (id, name) VALUES ($id, 'entity');
  `).run({ $id: crypto.randomUUID() });

  //clickable areas
  db.query(`
    CREATE TABLE IF NOT EXISTS pinAreas (
      id TEXT PRIMARY KEY,
      roomPinId TEXT NOT NULL,
      points TEXT NOT NULL, 
      FOREIGN KEY(roomPinId) REFERENCES roomPins(id) ON DELETE CASCADE
    );
  `).run();

});

try {
  initScript();
  console.log("database initialized successfully");
} catch (error) {
  console.error("error while initializing database:", error);
}

db.close();
