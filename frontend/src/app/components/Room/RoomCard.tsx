import {useCallback, useRef} from 'react';
import Stack from '@mui/material/Stack';

import '../../styles/room/roomCard.sass';
import {colorList} from '../../configs/constant';

type Props = {
    active: boolean,
    room: any
}

export default function RoomCard({active, room}: Props) {
    const { room_name } = room[0];
    const getAvatarColor = useCallback(() => {
        const max = colorList.length;
        const index = Math.floor(Math.random() * max);
        return colorList[index];
    },[room]);

    const colorRef = useRef(getAvatarColor());

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className={`
                roomcard--container
                ${active && `active`}
            `}
        >
            <Stack direction="row">
                <div
                    className="room--avatar"
                    style={{
                        color: colorRef.current
                    }}
                >
                    {room_name.slice(0,2)}
                </div>
                <div className="room--desc">
                    <p className="name">{room_name}</p>
                    <span className="status">1 online</span>
                </div>
            </Stack>
            <div className="room--notifications">2</div>
        </Stack>
    )
}