'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import { useRouter } from 'next/router';
import { useSocket } from './SocketContext';

const initialData = {
    rooms: [],
    currentRoom: '',
    setRooms: (list:[]) => {},
    setCurrentRoom: (id:string) => {}
}

const RoomContext = createContext(initialData);

function useRoom() {
    return useContext(RoomContext);
}
export default function RoomProvider({
    children
}:{
    children: ReactNode
}) {
    const { socket } = useSocket();
    const { query, push } = useRouter();
    const { roomId } = query;
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState<string>('');

    useEffect(() => {
        if (socket && roomId) {
            let room = rooms.find((item) => item === roomId)
            if (room) {
                setCurrentRoom(room);
            } else if (rooms.length) {
                push(`/room/${rooms[0]}`);
            }
        }
    }, [roomId, rooms]);

    return (
        <RoomContext.Provider value={{
            rooms,
            currentRoom,
            setCurrentRoom,
            setRooms
        }}>
            {children}
        </RoomContext.Provider>
    )
}

export {useRoom, RoomProvider};