import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import { useUser } from '@/app/contexts/UserContext';
import { useSocket } from '@/app/contexts/SocketContext';
import { useRoom } from '@/app/contexts/RoomContext';
import '../../styles/chat/ChatAction.sass';

export default function ChatAction() {
    const { socket, socketId } = useSocket();
    const { currentRoom } = useRoom();
    const { userData } = useUser();
    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<any>(null);
    const inputRef = useRef(null);

    const clickOutside = (e: any) => {
        if (
            !(emojiPickerRef.current.contains(e.target))
            || e.target === emojiPickerRef.current
        ){
            setShowEmojiPicker(false);
        }
    }

    useEffect(() => {
        if (showEmojiPicker) document.addEventListener('click', clickOutside, true);

        return () => {
            document.removeEventListener('click', clickOutside, true);
        }
    }, [showEmojiPicker])
    
    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') sendMessage();
    }

    const handleClickEmoji = () => setShowEmojiPicker(true);

    const insertEmoji = (emojiData: EmojiClickData) => {
        if (!inputRef.current) return;
        const { selectionStart, selectionEnd } = inputRef.current;
        
        setInput((prev => (
            prev.substring(0, selectionStart)
            + emojiData.emoji
            + prev.substring(selectionEnd)
        )));
        setShowEmojiPicker(false);
    }

    const sendMessage = () => {
        if (input.trim() && socket) {
            socket.emit('send_message', {
                text: input,
                name: userData.name,
                id: userData.id,
                time: new Date(),
                socketId: socketId,
                roomId: currentRoom[0].room_id
            });
            setInput('');
        }
    }

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            className="chatAction"
        >
            <Stack direction="row">
                <Box className="button--type">
                    <EmojiEmotionsIcon color="secondary" onClick={handleClickEmoji}/>
                </Box>
                <Box className="button--type">
                    <ImageIcon color="secondary"/>
                </Box>
            </Stack>
            <div className="input--container">
                <input
                    ref={inputRef}
                    placeholder='Aa'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                ></input>
            </div>
            <Stack
                className="button--send"
                justifyContent="center"
                alignItems="center"
                onClick={sendMessage}
            >
                <SendRoundedIcon
                    fontSize="small"
                    sx={{
                        transform: "rotate(-40deg) translate(3px)",
                        color: '#FFFFFF'
                    }}
                />
            </Stack>
            {showEmojiPicker && (
                <Box 
                    sx={{
                        position: 'absolute',
                        bottom: '120px'
                    }}
                    ref={emojiPickerRef}
                >
                    <EmojiPicker onEmojiClick={insertEmoji} />
                </Box>
            )}
        </Stack>
    )
}