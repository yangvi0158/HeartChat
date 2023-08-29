import { useState } from 'react';

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

type DialogProps = {
    open: boolean,
    closeCallback: () => void
}

export default function DialogComponent({
    open, closeCallback
}: DialogProps) {
    const [radioValue, setRadioValue] = useState('create');
    const [input, setInput] = useState('');

    const handleClose = () => {
        closeCallback();
        setInput('');
        setRadioValue('create');
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
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color='secondary'>Cancel</Button>
                <Button onClick={handleClose}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}