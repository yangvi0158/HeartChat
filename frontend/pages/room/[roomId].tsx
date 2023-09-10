import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { useSession } from 'next-auth/react';

import { useRoom } from '@/app/contexts/RoomContext';
import { useSocket } from '@/app/contexts/SocketContext';
import RoomSideBar from '@/app/components/Room/RoomSideBar';
import RoomMain from '@/app/components/Room/RoomMain';
import '@/app/styles/room.sass';

export default function Room () {
    const {socket, socketId, messages} = useSocket();
    const {rooms, setRooms, currentRoom, setCurrentRoom} = useRoom();
    // const { data: session, status } = useSession();

    const initWebSocket = () => {
        socket.on('getRooms', (rooms: any) => {
            console.log('getRoom')
            setRooms(rooms);
        })

        // Server 通知完後再傳送 disConnection 通知關閉連線
        socket.on('disConnection', () => {
            console.log('close!')
            socket.close()
        })
    }

    const disconnectWebSocket = () => {
        socket.emit('disConnection', 'XXX')
    }

    useEffect(() => {
        if (socket) {
            initWebSocket();
            socket.emit('addRoom', 'Global-Room');
        }
    },[socket]);

    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems='center'
            className="roomContainer"
        >
            <RoomSideBar rooms={rooms} currentRoom={currentRoom}/>
            <RoomMain rooms={rooms} currentRoom={currentRoom}/>
            {/* <button onClick={disconnectWebSocket}>段線</button> */}
        </Stack>
    )
};