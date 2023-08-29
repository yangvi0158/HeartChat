import Stack from '@mui/material/Stack';

import '../../styles/chat/ChatBody.sass';

export default function ChatBody() {
    return (
        <div className="chatBody">
            <Stack className="message-item" direction="row">
                <div className="avatar">GL</div>
                <Stack>
                    <p className="name">User1</p>
                    <span className="message">
                        Hello This is my first time using this app.
                    </span>
                    <p className="time">16:45 pm</p>
                </Stack>
            </Stack>
            <Stack className="message-item" direction="row">
                <div className="avatar">GL</div>
                <Stack>
                    <p className="name">User1</p>
                    <span className="message">
                        Hello This is my first time using this app.
                        Hello This is my first time using this app.
                        Hello This is my first time using this app.
                        Hello This is my first time using this app.

                    </span>
                    <p className="time">16:45 pm</p>
                </Stack>
            </Stack>
            <Stack className="message-item" direction="row">
                <div className="avatar">GL</div>
                <Stack>
                    <p className="name">User1</p>
                    <span className="message">
                        Hello This is.
                    </span>
                    <p className="time">16:45 pm</p>
                </Stack>
            </Stack>
        </div>
    )
}