import Stack from '@mui/material/Stack';

import RoomCard from '../Room/RoomCard';
import '../../styles/room/roomSideBar.sass'
import styles from '../../styles/index.module.sass';
import roomStyles from '../../styles/room/room.module.sass';

export default function RoomSideBar() {
    return (
        <div className={`${roomStyles.roomSection} roomSideBar`}>
            <Stack 
                className="selfInfo--block"
                direction="row"
                alignItems="center"
            >
                <Stack
                    className="selfInfo--avatar"
                    justifyContent="center"
                    alignItems="center"
                >
                        V
                </Stack>
                <p>viboloveyou12</p>
            </Stack>
            <div className="rooms--block">
                <p className="title">My Rooms</p>
                <RoomCard active/>
                <RoomCard />
                <RoomCard />
            </div>
            <Stack className="actions--block">
                <button className={`${styles.button}`}>Create Room</button>
                <button className={`${styles.button} ${styles.buttonSecondary}`}>Sign out</button>
            </Stack>
        </div>
    )
}