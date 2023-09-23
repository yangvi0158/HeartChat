import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { colorList } from '@/app/configs/constant';
import { socket } from '@/app/socket';
import '@/app/styles/signup.sass';
import styles from '@/app/styles/index.module.sass';

interface User {
    name: string;
    avatarColor: string;
}


export default function Signup() {
    const { data: session, status } = useSession();
    const [userInfo, setUserInfo] = useState<User>({
        name: '',
        avatarColor: colorList[0]
    });
    const { push } = useRouter();

    const addUser = () => {
        if (!userInfo.name.length) return;
        const { user } = session;

        if (user) {
            console.log('user id', user.id)
            socket.emit('addUser', {
                id: user.id,
                name: userInfo.name,
                avatar_color: userInfo.avatarColor
            })
        }
        push('/room/init');
    }

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            className="signup"
        >
            <Stack direction="row" alignItems="center">
                {/* <Image src={Logo} alt="logo"></Image> */}
                <p>Hello!</p>
            </Stack>
            <span>
                Choose a display name and pick a color that you like!
            </span>
            <TextField
                id="outlined-basic"
                label="Display Name"
                variant="filled"
                sx={{
                    backgroundColor: '#3e4366',
                    borderRadius: '10px',
                    width: '300px',
                    marginTop: '50px'
                }}
                onChange={(e) => setUserInfo((prev) => ({
                    ...prev,
                    name: e.target.value
                }))}
            />
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{
                    padding: '20px 0',
                    margin: '20px 0'
                }}
            >
                {colorList.map((color, key) => (
                    <Box
                        key={key}
                        className={`colorItem ${
                            userInfo.avatarColor === color 
                            && `selectedColor`}
                        `}
                        onClick={() => setUserInfo((prev) => ({
                            ...prev,
                            avatarColor: color
                        }))}
                        sx={{
                            backgroundColor: color
                        }}
                    ></Box>
                ))}
            </Stack>
            <button
                onClick={addUser}
                className={`${styles.button} button`}
            >
                Let's Chat!
            </button>
        </Stack>
    )
}