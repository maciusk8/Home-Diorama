import { useQuery } from "@tanstack/react-query";
import type { DbRoom, DbPin, DbLight, DbArea, DbPinType, DbLightType } from "../../../server/db/types";

export interface HomeDataResponse {
    rooms: DbRoom[];
    pins: DbPin[];
    lights: DbLight[];
    areas: DbArea[];
    lightTypes: DbLightType[];
}

export default function useHomeData() {
    // /api/rooms returns all foundational home data (rooms, pins, lights, areas, lightTypes)
    // to prevent lag when switching rooms.
    const { data: homeData, isLoading: isLoadingHome } = useQuery<HomeDataResponse>({
        queryKey: ['homeData'],
        queryFn: () => fetch('/api/local/rooms').then(res => res.json()),
    });

    const { data: pinTypes, isLoading: isLoadingPinTypes } = useQuery<DbPinType[]>({
        queryKey: ['pinTypes'],
        queryFn: () => fetch('/api/local/pinTypes').then(res => res.json()),
    });

    return {
        rooms: homeData?.rooms,
        pins: homeData?.pins,
        lights: homeData?.lights,
        areas: homeData?.areas,
        lightTypes: homeData?.lightTypes,
        pinTypes,
        isLoading: isLoadingHome || isLoadingPinTypes
    };
}   