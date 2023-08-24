import Stack from '@mui/material/Stack';

import RoomSideBar from '@/app/components/Room/RoomSideBar';
import RoomMain from '@/app/components/Room/RoomMain';
import '@/app/styles/room.sass'


export default function Room () {
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems='center'
            className="roomContainer"
        >
            <RoomSideBar />
            <RoomMain />
        </Stack>
    )
};