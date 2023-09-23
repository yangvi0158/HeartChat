import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import ChatBody from '../Chat/ChatBody';
import ChatAction from '../Chat/ChatAction';
import ShareRoomDialog from '../Dialog/ShareRoomDialog';
import '../../styles/room/roomMain.sass'
import styles from '../../styles/index.module.sass';
import roomStyles from '../../styles/room/room.module.sass';
import { useSocket } from '../../contexts/SocketContext';
import { useUser } from '../../contexts/UserContext';
import { useRoom } from '../../contexts/RoomContext';
import { globalRoomId } from '../../configs/constant';

export default function RoomMain() {
    const [openDialog, setOpenDialog] = useState(false);
    const { socket } = useSocket();
    const { userData } = useUser();
    const { currentRoom } = useRoom();
    const { room_id, room_name } = currentRoom[0] || '';

    const handleClickOpen = () => setOpenDialog(true);
    const handleClickCLose = () => setOpenDialog(false);

    // TODO 
    const handleLeaveRoom = () => {
        socket.emit('leaveRoom', {
            currentRoom: currentRoom,
            userName: userData.name
        });
    }

    return (
        <div className={`${roomStyles.roomSection} roomMain`}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="roomMain--topBar"
            >
                <div className='chatroom-title'>
                    <h2>{ currentRoom.length > 0 && room_name }</h2>
                </div>
                <Stack direction="row">
                    <Box sx={{mr: 2}}>
                        <Tooltip title="Invite/Share">
                            <button
                                className={`${styles.button}`}
                                onClick={handleClickOpen}
                            >
                                Invite
                            </button>
                        </Tooltip>
                    </Box>
                    {room_id !== globalRoomId && (
                        <button
                            className={`
                                ${styles.button}
                                ${styles.buttonSecondary}
                            `}
                            onClick={handleLeaveRoom}
                        >
                            Leave
                        </button>
                    )}
                </Stack>
            </Stack>
            <div className="chat--container">
                <ChatBody/>
                <ChatAction/>
            </div>
            <ShareRoomDialog open={openDialog} closeDialog={handleClickCLose}/>
        </div>
    )
}