/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";
import { useSocket } from "./SocketContext";
import { IRoomArray, IRoomNestedArray } from "../interfaces/IRoom";

type RoomContextType = {
  rooms: IRoomNestedArray;
  currentRoom: IRoomArray;
  setRooms: React.Dispatch<React.SetStateAction<IRoomNestedArray>>;
  setCurrentRoom: React.Dispatch<React.SetStateAction<IRoomArray>>;
  setIsInit: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialData: RoomContextType = {
  rooms: [],
  currentRoom: [],
  setRooms: () => {},
  setCurrentRoom: () => {},
  setIsInit: () => {},
};

const RoomContext = createContext<RoomContextType>(initialData);

function useRoom() {
  return useContext(RoomContext);
}
export default function RoomProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket();
  const { query, push } = useRouter();
  const { roomId } = query || "";
  const [rooms, setRooms] = useState<IRoomNestedArray>([]);
  const [currentRoom, setCurrentRoom] = useState<IRoomArray>([]);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (socket && roomId) {
      const room = rooms?.find((item) => item[0]["room_id"] === roomId);
      if (room) {
        setCurrentRoom(room);
      } else if (rooms?.length) {
        push(`/room/${rooms[0][0]["room_id"]}`);
      }
    }
  }, [roomId, rooms]);

  useEffect(() => {
    if (rooms.length && !isInit) {
      socket.emit("enter", rooms);
      setIsInit(true);
    }
  }, [isInit, rooms]);

  return (
    <RoomContext.Provider
      value={{
        rooms,
        currentRoom,
        setCurrentRoom,
        setRooms,
        setIsInit,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export { useRoom, RoomProvider };
