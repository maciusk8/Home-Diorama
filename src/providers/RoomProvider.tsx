import { createContext, useContext, useState, type ReactNode } from "react";
import type { Room } from '../types/rooms';

interface RoomContextType {
  rooms: Room[];
  currentRoom: Room | null; 
  areaMap: Map<string, [number, number][]>;
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>; 
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  setAreaMap: React.Dispatch<React.SetStateAction<Map<string, [number, number][]>>>;
}

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

interface RoomProviderProps {
  children: ReactNode;
}

export default function RoomProvider({ children }: RoomProviderProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [areaMap, setAreaMap] = useState<Map<string, [number, number][]>>(new Map());

    return (
        <RoomContext.Provider value={{ rooms, setRooms, currentRoom, setCurrentRoom, areaMap, setAreaMap }}>
            {children}
        </RoomContext.Provider>
    );
}

