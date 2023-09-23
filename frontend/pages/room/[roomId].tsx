import { useEffect } from 'react';
import Stack from '@mui/material/Stack';

import { useUser } from '@/app/contexts/UserContext';
import { useRoom } from '@/app/contexts/RoomContext';
import { useSocket } from '@/app/contexts/SocketContext';
import RoomSideBar from '@/app/components/Room/RoomSideBar';
import RoomMain from '@/app/components/Room/RoomMain';
import '@/app/styles/room.sass';

export default function Room () {
    const { socket } = useSocket();
    const { setRooms } = useRoom();
    const { userData } = useUser();

    const initWebSocket = () => {
        socket.on('getRooms', (rooms: any) => {
            setRooms(rooms);
        })

        // Server 通知完後再傳送 disConnection 通知關閉連線
        socket.on('disConnection', () => {
            console.log('close!')
            socket.close()
        })
    }

    // const disconnectWebSocket = () => {
    //     socket.emit('disConnection', 'XXX')
    // }

    useEffect(() => {
        if (socket) initWebSocket();
    },[socket, userData]);

    useEffect(() => {
        if (socket) socket.emit('getRooms', userData.id);
    }, [socket, userData?.id])

    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems='center'
            className="roomContainer"
        >
            <RoomSideBar/>
            <RoomMain/>
        </Stack>
    )
};