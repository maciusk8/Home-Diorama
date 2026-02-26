import type { DbRoom } from "../../../server/db/types";

/**
 * Generates unique URL slugs from a list of rooms.
 * Duplicate names get a numeric suffix: Salon, Salon1, Salon2, etc.
 * Returns a Map of roomId -> slug.
 */
export function generateSlugs(rooms: DbRoom[]): Map<string, string> {
    const slugMap = new Map<string, string>();
    const nameCount = new Map<string, number>();

    for (const room of rooms) {
        const count = nameCount.get(room.name) ?? 0;
        const slug = count === 0 ? room.name : `${room.name}${count}`;
        slugMap.set(room.id, slug);
        nameCount.set(room.name, count + 1);
    }

    return slugMap;
}

/**
 * Finds a room by its URL slug.
 * Rebuilds the slug map and returns the matching room.
 */
export function findRoomBySlug(rooms: DbRoom[], slug: string): DbRoom | undefined {
    const slugMap = generateSlugs(rooms);

    for (const [roomId, roomSlug] of slugMap) {
        if (roomSlug === slug) {
            return rooms.find(r => r.id === roomId);
        }
    }

    return undefined;
}
