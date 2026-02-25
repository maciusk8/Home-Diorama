import { Database } from "bun:sqlite";

export const db = new Database("ha_dashboard.sqlite");
db.query("PRAGMA foreign_keys = ON;").run();
