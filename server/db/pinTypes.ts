import { db } from "./connection";

export const getPinTypes = () => {
    return db.query(`SELECT * FROM pinTypes`).all();
};

export const getPinTypeById = (id: string) => {
    return db.query(`SELECT * FROM pinTypes WHERE id = $id`).get({ $id: id });
};
