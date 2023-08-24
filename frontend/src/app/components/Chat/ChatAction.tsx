import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import '../../styles/chat/ChatAction.sass';

export default function ChatAction() {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            className="chatAction"
        >
            <Stack direction="row">
                <Box className="button--type">
                    <EmojiEmotionsIcon color="secondary" />
                </Box>
                <Box className="button--type">
                    <ImageIcon color="secondary"/>
                </Box>
            </Stack>
            <div className="input--container">
                <input placeholder='Aa'></input>
            </div>
            <Stack
                className="button--send"
                justifyContent="center"
                alignItems="center"
            >
                <SendRoundedIcon
                    color="info"
                    fontSize="small"
                    sx={{
                        transform: "rotate(-40deg) translate(3px)"
                    }}
                />
            </Stack>
        </Stack>
    )
}