import { useState, KeyboardEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

import { useUser } from '../../contexts/UserContext';
import { useSocket } from '../../contexts/SocketContext';

type DialogProps = {
    open: boolean,
    closeDialog: () => void
}

export default function DialogComponent({
    open, closeDialog
}: DialogProps) {
    const { userData } = useUser();
    const { socket } = useSocket();
    const [radioValue, setRadioValue] = useState('create');
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);

    const handleClose = () => {
        setTimeout(() => closeDialog(), 0);
        setInput('');
        setError(false);
        setRadioValue('create');
    }

    const handleKeyDown = (evt: KeyboardEvent<HTMLElement>) => {
        if (evt.key === 'Enter') {
            handleConfirm();
        }
    }

    const handleConfirm = () => {
        if (!input) return;
        if (radioValue === 'create') {
            if (!validateInput()) {
                setError(true);
                return;
            }
            setError(false);
            socket.emit('addRoom', {
                room: input,
                userName: userData.name,
                userId: userData.id
            });
        } else {
            setError(false);
            socket.emit('joinRoom', {
                userName: userData.name,
                userId: userData.id,
                roomId: input
            })
        }
        handleClose();
    }

    const validateInput = () => {
        const regex = new RegExp(/^[a-zA-Z0-9-]*$/);
        const result = input.length && input.match(regex)
            ? true
            : false
        
        return result;
    }

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRadioValue((event.target as HTMLInputElement).value);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create / Join Room</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={radioValue}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="create" control={<Radio />} label="Create Room" />
                            <FormControlLabel value="join" control={<Radio />} label="Join an existed Room" />
                        </RadioGroup>
                    </FormControl>
                    <DialogContentText>
                    </DialogContentText>
                    <TextField
                        error={error}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        label={radioValue === 'create' ? 'Room Name' : 'Existed Room ID'}
                        variant="standard"
                        value={input}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setInput(event.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        helperText={ radioValue === 'create'
                            ? 'The room name only accepts letters, numbers, and dash.'
                            : ''
                        }
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color='secondary'>Cancel</Button>
                <Button onClick={handleConfirm} disabled={!input}>
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}