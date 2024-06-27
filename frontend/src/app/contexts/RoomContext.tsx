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
import { useUser } from "./UserContext";
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
  const { userData } = useUser();
  const [rooms, setRooms] = useState<IRoomNestedArray>([]);
  const [currentRoom, setCurrentRoom] = useState<IRoomArray>([]);
  const [isInit, setIsInit] = useState(false);
  //console.log("rooms", rooms, currentRoom);

  useEffect(() => {
    if (!socket) return;

    function onGetRooms(result: IRoomNestedArray) {
      setRooms(result);
    }
    socket.on("getRooms", onGetRooms);

    if (userData.id) {
      socket.emit("getRooms", userData.id);
    }

    return () => {
      socket.off("getRooms", onGetRooms);
    };
  }, [socket, userData?.id]);

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
