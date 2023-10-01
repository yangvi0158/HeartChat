import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Image from 'next/image';
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
    const [sendable, setSendable] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File|undefined>();
    const [isShowError, setIsShowError] = useState(false);
    const emojiPickerRef = useRef<HTMLElement>();
    const inputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const client = new S3Client({
        region: 'eu-west-2',
        credentials: {
            secretAccessKey: `${process.env.NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY}`,
            accessKeyId: `${process.env.NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID}`
        }
    });

    const clickOutside = (e: MouseEvent) => {
        if (
            !(emojiPickerRef?.current?.contains(e.target as HTMLElement))
            || e.target === emojiPickerRef.current
        ){
            setShowEmojiPicker(false);
        }
    }

    const compositionStartHandler = () => { setSendable(false) };
    const compositionEndHandler = () => { setSendable(true) };

    useEffect(() => {
        if (showEmojiPicker) document.addEventListener('click', clickOutside, true);
        inputRef.current?.addEventListener('compositionstart', compositionStartHandler);
        inputRef.current?.addEventListener('compositionend', compositionEndHandler);

        return () => {
            document.removeEventListener('click', clickOutside, true);
            inputRef.current?.removeEventListener('compositionstart', compositionStartHandler);
            inputRef.current?.removeEventListener('compositionend', compositionEndHandler);
        }
    }, [showEmojiPicker])
    
    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter' && sendable) sendMessage();
    }

    const handleClickEmoji = () => setShowEmojiPicker(true);

    const insertEmoji = (emojiData: EmojiClickData) => {
        if (!inputRef.current) return;
        const { selectionStart, selectionEnd } = inputRef.current || {};
        setInput((prev => (
            prev.substring(0, selectionStart || 0)
            + emojiData.emoji
            + prev.substring(selectionEnd || 0)
        )));
        setShowEmojiPicker(false);
        inputRef.current.focus();
    }

    const sendMessage = async() => {
        if (input.trim() && socket) {
            socket.emit('sendMessage', {
                text: input.trim(),
                name: userData.name,
                id: userData.id,
                time: new Date(),
                socketId: socketId,
                roomId: currentRoom[0]['room_id'],
                imageUrl: ''
            });
            setInput('');
        }
        if (imageFile && !isShowError) {
            const imageId = imageFile.lastModified + "_" + imageFile.name;
            setTimeout(() => {
                socket.emit('sendMessage', {
                    text: '--image--',
                    name: userData.name,
                    id: userData.id,
                    time: new Date(),
                    socketId: socketId,
                    roomId: currentRoom[0]['room_id'],
                    imageUrl: encodeURIComponent(imageId)
                });
            }, 700)
            handleUploadImage();
            removeImage();
        }
    }

    const isFileOverSize = (file:File) => {
        if (!file) return false;
        const fileSize = file.size;
        const fileMb = fileSize / 1024 ** 2;
        if (fileMb > 2) return true;
        return false;
    }

    const removeImage = () => {
        setImageUrl('');
        setImageFile(undefined);
        imageInputRef.current!.value = '';
    }

    const previewImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const target = evt.target as HTMLInputElement;
        if (target.files && target.files.length) {
            const file = target.files[0];
            let isOverSize = isFileOverSize(file);
            setIsShowError(isOverSize);
            setImageUrl(URL.createObjectURL(file));
            setImageFile(file);
            inputRef.current!.focus();
        }
    }

    const handleUploadImage= async () => {
        if (!imageFile) return;
        const imageId = imageFile.lastModified + "_" + imageFile.name;
        const command = new PutObjectCommand({
            "Bucket": process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            "Key": `images/${imageId}`,
            "Body": imageFile,
        });
        try {
            await client.send(command);
        } catch (error) {
            console.log(error);
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
                    <input
                        type="file"
                        accept=".gif, .jpg, .png, .jpeg"
                        name="image"
                        id="file"
                        onChange={(e) => previewImage(e)}
                        style={{display: 'none'}}
                        ref={imageInputRef}
                    />
                    <label htmlFor="file" style={{cursor: 'pointer'}}>
                        <ImageIcon color="secondary"/>
                    </label>
                </Box>
            </Stack>
            <div className="input--container">
                {imageUrl && (
                    <div className="image--container">
                        <div className="image">
                            <Image src={imageUrl} width={0} height={0} sizes="30px" alt="preview" />
                            <Stack className="delete-btn" justifyContent="center" alignItems="center" onClick={removeImage}>×</Stack>
                        </div>
                        {isShowError && <span>Please select a file less than 2MB.</span>}
                    </div>
                )}
                <input
                    ref={inputRef}
                    placeholder='Aa'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={imageUrl && `hasImage`}
                >
                </input>
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