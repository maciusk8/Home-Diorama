import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useHomeData from '@/shared/hooks/useHomeData';
import { findRoomBySlug } from '@/shared/utils/roomSlugs';
import type { DbRoom, DbPin, DbLight, DbArea } from '../../../server/db/types';

export interface CurrentRoomData {
    room: DbRoom | undefined;
    pins: DbPin[];
    lights: DbLight[];
    areas: DbArea[];
    areaMap: Map<string, [number, number][]>;
    lightTypeMap: { byId: Map<string, string>; byName: Map<string, string> };
    pinTypeMap: { byId: Map<string, string>; byName: Map<string, string> };
    isLoading: boolean;
}

/**
 * Derives the current room + its related data (pins, lights, areas)
 * from the URL param + useHomeData. Replaces the old RoomContext.
 * I think it's a good idea to store data in te cache rather than fetching it every time
 * from the server. Because no one have 100+ rooms in their house. :)
 */
export default function useCurrentRoom(): CurrentRoomData {
    const { roomName } = useParams();
    const { rooms, pins, lights, areas, lightTypes, pinTypes, isLoading } = useHomeData();

    const room = useMemo(() => {
        if (!rooms || !roomName) return undefined;
        return findRoomBySlug(rooms, roomName);
    }, [rooms, roomName]);

    const roomPins = useMemo(() => {
        if (!room || !pins) return [];
        return pins.filter(p => p.roomId === room.id);
    }, [room, pins]);

    const roomPinIds = useMemo(() => new Set(roomPins.map(p => p.id)), [roomPins]);

    const roomLights = useMemo(() => {
        if (!lights) return [];
        return lights.filter(l => roomPinIds.has(l.pinId));
    }, [lights, roomPinIds]);

    const roomAreas = useMemo(() => {
        if (!room || !areas || !pins) return [];
        const roomPinIds = new Set(pins.filter(p => p.roomId === room.id).map(p => p.id));
        return areas.filter(a => roomPinIds.has(a.roomPinId));
    }, [room, areas, pins]);

    const areaMap = useMemo(() => {
        const map = new Map<string, [number, number][]>();
        for (const area of roomAreas) {
            // Find the pin this area belongs to, use pin's entity-like id
            const pin = roomPins.find(p => p.id === area.roomPinId);
            if (!pin) continue;
            // area.points is JSON string of [number, number][]
            try {
                const points = JSON.parse(area.points) as [number, number][];
                map.set(pin.typeId, points);
            } catch { /* skip malformed */ }
        }
        return map;
    }, [roomAreas, roomPins]);

    const lightTypeMap = useMemo(() => {
        const byId = new Map<string, string>();
        const byName = new Map<string, string>();
        for (const lt of (lightTypes ?? [])) {
            byId.set(lt.id, lt.name);
            byName.set(lt.name, lt.id);
        }
        return { byId, byName };
    }, [lightTypes]);

    const pinTypeMap = useMemo(() => {
        const byId = new Map<string, string>();
        const byName = new Map<string, string>();
        for (const pt of (pinTypes ?? [])) {
            byId.set(pt.id, pt.name);
            byName.set(pt.name, pt.id);
        }
        return { byId, byName };
    }, [pinTypes]);

    return { room, pins: roomPins, lights: roomLights, areas: roomAreas, areaMap, lightTypeMap, pinTypeMap, isLoading };
}
