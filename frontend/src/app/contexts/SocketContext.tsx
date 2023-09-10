'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';

import { socket } from '../socket';

const initialData = {
    socket: null,
    //roomUsers: {},
    messages: {}
}
const SocketContext = createContext(initialData);

function useSocket() {
    return useContext(SocketContext);
}

export default function SocketProvider({
    children
}: {
    children: ReactNode
}) {
    const [socketId, setSocketId] = useState('');
    const [roomUsers, setRoomUsers] = useState({});
    const [messages, setMessages] = useState({});

    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);
    

    useEffect(() => {
        function onReceiveMsg(data: any) {
            setMessages((prev) => {
                const newMessages = {...prev};
                newMessages[data.roomId] = [...(newMessages[data.roomId] ?? []), data];
                console.log('newMessages', newMessages)
                return newMessages;
            })
        }
        function onConnect() {
            setSocketId(socket.id);
        }

        socket.on('connect', onConnect);
        socket.on('receive_message', onReceiveMsg);

        return () => {
            //disconnect
            socket.off('receive_message', onReceiveMsg);
            
        }
    }, [messages]);

    return (
        <SocketContext.Provider value={{
            socket,
            messages,
            socketId
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export {useSocket, SocketProvider};