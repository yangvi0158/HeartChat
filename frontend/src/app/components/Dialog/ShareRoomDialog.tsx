import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import TwitterIcon from '@mui/icons-material/Twitter';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useSnackBar } from '../../hooks/useSnackBar'; 

type DialogProps = {
    open: boolean,
    closeCallback: () => void
}

export default function DialogComponent({
    open, closeCallback
}: DialogProps) {
    const [roomID, ] = useState('123455678sdffhhjkktre');
    const openSnackBar = useSnackBar();

    const handleClose = () => {
        closeCallback();
    }
    const handleCopy = () => {
        navigator.clipboard.writeText(roomID);
        openSnackBar({
            text: 'Copied!',
            status: 'success'
        })
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Share</DialogTitle>
                <DialogContent>
                    <TwitterIcon />
                </DialogContent>
                <DialogTitle>Or Copy Room ID</DialogTitle>
                <DialogContent>
                    <Stack direction="row" alignItems="center">
                        <TextField
                            id="outlined-basic"
                            value={roomID}
                            fullWidth
                            disabled
                        >
                        </TextField>
                        <Tooltip title="Copy">
                            <IconButton 
                                aria-label="menu"
                                sx={{height: '40px', marginLeft: '20px'}}
                                onClick={handleCopy}
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    
                </DialogContent>
            </Dialog>
        </div>
    )
}