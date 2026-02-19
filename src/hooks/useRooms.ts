import { useContext } from "react";
import { RoomContext } from '../providers/RoomProvider';

export function useRooms() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRooms must be used within a RoomProvider");
  }

  return context;
}