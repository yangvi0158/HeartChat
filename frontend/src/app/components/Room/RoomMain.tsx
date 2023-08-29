import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';

import ChatBody from '../Chat/ChatBody';
import ChatAction from '../Chat/ChatAction';
import ShareRoomDialog from '../Dialog/ShareRoomDialog';
import '../../styles/room/roomMain.sass'
import styles from '../../styles/index.module.sass';
import roomStyles from '../../styles/room/room.module.sass';

export default function RoomMain() {
    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpen = () => setOpenDialog(true);
    const handleClickCLose = () => setOpenDialog(false);

    return (
        <div className={`${roomStyles.roomSection} roomMain`}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                className="roomMain--topBar"
            >
                <div className='chatroom-title'>
                    <h2>Global Chatroom</h2>
                </div>
                <Stack direction="row">
                    <Box sx={{mr: 2}}>
                        <Tooltip title="Invite/Share">
                            <button className={`${styles.button}`} onClick={handleClickOpen}>
                                Invite
                            </button>
                        </Tooltip>
                    </Box>
                    <Tooltip title="Leave Room">
                        <button className={`${styles.button} ${styles.buttonSecondary}`}><LogoutIcon/></button>
                    </Tooltip>
                </Stack>
            </Stack>
            <div className="chat--container">
                <ChatBody/>
                <ChatAction />
            </div>
            <ShareRoomDialog open={openDialog} closeCallback={handleClickCLose}/>
        </div>
    )
}