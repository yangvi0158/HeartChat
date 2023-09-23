import { useRef, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';

import { useUser } from '../../contexts/UserContext';
import { useRoom } from '../../contexts/RoomContext';
import { useSocket } from '@/app/contexts/SocketContext';
import '../../styles/chat/ChatBody.sass';

export default function ChatBody() {
    const { userData } = useUser();
    const { messages } = useSocket();
    const { currentRoom } = useRoom();
    const { room_id } = currentRoom[0] || 0;
    const chatBottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);
    

    return (
        <div className="chatBody">
            {messages[room_id] && (messages[room_id]).map((msg, key) => 
                msg.socketId === 'wsSystem' ? (
                    <Stack
                        className="message-item"
                        direction="row"
                        justifyContent="center"
                        key={key}
                    >
                        {msg.text}
                    </Stack>
                ) : (msg.id === userData.id) ? (
                    <Stack
                        className="message-item self"
                        direction="row"
                        justifyContent="end"
                        key={key}
                    >
                        <Stack direction="column" alignItems="end" sx={{width: '100%'}}>
                            <span className="message">{msg.text}</span>
                            <p className="time">
                                {dayjs(msg.time).format('HH:mm')}
                            </p>
                        </Stack>
                    </Stack>
                ) : (
                    <Stack
                        className="message-item"
                        direction="row"
                        key={key}
                    >
                        <div>
                            <div className="avatar">
                                {msg.name.slice(0,2)}
                            </div>
                        </div>
                        <Stack alignItems="start" sx={{width: '100%'}}>
                            <p className="name">{msg.name}</p>
                            <span className="message">
                                {msg.text}
                            </span>
                            <p className="time">
                                {dayjs(msg.time).format('HH:mm')}
                            </p>
                        </Stack>
                    </Stack>
                )
            )}
            <div id="chatBody-bottom" ref={chatBottomRef}></div>
        </div>
    )
}