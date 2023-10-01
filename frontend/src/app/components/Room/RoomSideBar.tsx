import { useState } from 'react';
import { useRouter } from 'next/router';
import Stack from '@mui/material/Stack';
import { signOut } from 'next-auth/react';

import { useUser } from '@/app/contexts/UserContext';
import { useRoom } from '@/app/contexts/RoomContext';
import { useSocket } from '@/app/contexts/SocketContext';
import CreateRoomDialog from '../Dialog/CreateRoomDialog';
import RoomCard from '../Room/RoomCard';
import '../../styles/room/roomSideBar.sass'
import styles from '../../styles/index.module.sass';
import roomStyles from '../../styles/room/room.module.sass';
import IMessage from '@/app/interfaces/IMessage';

export default function RoomSideBar() {
    const { push } = useRouter();
    const { currentRoom, rooms, setIsInit } = useRoom();
    const [openDialog, setOpenDialog] = useState(false);
    const { userData } = useUser();
    const { socket, messages, lastSeenMsg } = useSocket();

    const handleClickOpen = () => setOpenDialog(true);
    const handleClickCLose = () => setOpenDialog(false);
    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
        socket.emit('disconnection', rooms);
        socket.close();
        setIsInit(false);
    }
    
    return (
        <div className={`${roomStyles.roomSection} roomSideBar`}>
            <Stack 
                className="selfInfo--block"
                direction="row"
                alignItems="center"
                onClick={() => { push('/')}}
            >
                <Stack
                    className="selfInfo--avatar"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        backgroundColor: userData.avatarColor
                    }}
                >
                        {userData.name && userData.name[0].toUpperCase()}
                </Stack>
                <p>{userData.name && userData.name}</p> 
            </Stack>
            <div className="rooms--block">
                <p className="title">My Rooms</p>
                {rooms && rooms.map((room, key) => {
                    const roomId = room[0]['room_id'];
                    const currentRoomId = currentRoom[0]?.['room_id'];
                    const roomMsgs = messages[roomId] || [];
                    const lastRoomMsgs = roomMsgs.findLast((item: IMessage) => item.id !== userData.id) || {}
                    const hasUnreadMsg = !roomMsgs.length
                        ? false
                        : lastRoomMsgs.text && (lastSeenMsg[roomId] !== lastRoomMsgs.text + lastRoomMsgs.time)
                    return (
                        <div
                            onClick={() => {
                                push(`/room/${roomId}`);
                            }} 
                            key={key}
                        >
                            <RoomCard
                                room={room}
                                active={roomId === currentRoomId}
                                hasUnreadMsg={hasUnreadMsg}
                            />
                        </div>
                    )
                })}
            </div>
            <Stack className="actions--block">
                <button
                    className={`${styles.button}`}
                    onClick={handleClickOpen}
                >
                    Create Room
                </button>
                <button
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={handleSignOut}
                >
                    Sign out
                </button>
                <CreateRoomDialog open={openDialog} closeDialog={handleClickCLose}/>
            </Stack>
        </div>
    )
}