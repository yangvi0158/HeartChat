'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { socket } from '../socket';
import IUser from '../interfaces/IUser';



const initialData = {
    userData: {
        name: '',
        id: '',
        avatarColor: '#1c203f',
        roomList: [] as string[],
    },
    setUserData: (data: IUser) => {}
}

const UserContext = createContext(initialData);

function useUser() {
    return useContext(UserContext);
}

function UserProvider({
    children
}: {
    children: ReactNode
}) {
    const { pathname } = useRouter();
    const { data: session } = useSession();
    const [userData, setUserData] = useState<IUser>(initialData.userData);

    useEffect(() => {
        if (socket && !userData.name && session) {
            const { user: { id } } = session;
            socket.emit('getUser', id);
        }
    }, [socket, userData, session, pathname]);

    useEffect(() => {
        function onGetCurrentUser(data: any) {
            if (!data.length) return;
            const { name, id, avatar_color, room_list } = data[0];
            
            setUserData({
                name: name,
                id: id,
                avatarColor: avatar_color,
                roomList: room_list
            })
        }

        socket.on('getCurrentUser', onGetCurrentUser);
        
        return () => {
            socket.off('getCurrentUser', onGetCurrentUser);
        }
    }, [])



    return (
        <UserContext.Provider value={{
            userData,
            setUserData
        }}>
            {children}
        </UserContext.Provider>
    )
}

export {useUser, UserProvider};