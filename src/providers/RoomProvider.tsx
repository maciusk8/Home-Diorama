import { createContext, useContext, useState, type ReactNode } from "react";
import type { Room } from '../types/rooms';

interface RoomContextType {
  rooms: Room[];
  currentRoom: Room | null; 
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>; 
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>;
}

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

interface RoomProviderProps {
  children: ReactNode;
}

export default function RoomProvider({ children }: RoomProviderProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    return (
        <RoomContext.Provider value={{ rooms, setRooms, currentRoom, setCurrentRoom }}>
            {children}
        </RoomContext.Provider>
    );
}

