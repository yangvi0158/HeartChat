import Stack from '@mui/material/Stack';

import '../../styles/room/roomCard.sass';

export default function RoomCard({active}: any) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className={`roomcard--container ${active && `active`}`}
        >
            <Stack direction="row">
                <div className="room--avatar">GC</div>
                <div className="room--desc">
                    <p className="name">Global Chatroom</p>
                    <span className="status">1 online</span>
                </div>
            </Stack>
            <div className="room--notifications">2</div>
        </Stack>
    )
}