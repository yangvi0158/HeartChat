const express = require('express');
const app = express();

const psql = require('./psql');

const server = require('http').Server(app)
    .listen(8000, () => {
        console.log('open server!')
    })

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
})

io.on('connection', async(socket) => {
    console.log('server success connect!');

    socket.on('getUser', async (userId) => {
        if (!userId) return;
        try {
            let result = await psql.getCurrentUser(userId);
            socket.emit('getCurrentUser', result);
        } catch (error) {
            console.error(error);
        }
    })

    socket.on('addUser', (data) => {
        try {
            psql.insertUser(data);
        } catch (error) {
            console.error(error);
        }
    })

    socket.on("send_message", (data) => {
        console.log('send_message', data)
        io.emit("receive_message", data);
    })
    
    /*只回傳給發送訊息的 client*/
    // socket.emit('getMessage', message)

    /*回傳給所有連結著的 client*/
    // io.emit('getMessageAll', message)

    /*回傳給除了發送者外所有連結著的 client*/
    // socket.broadcast.emit('getMessageLess', message)

    socket.on('getRooms', async (userId) => {
        try {
            let roomList = await psql.getRooms(userId);
            socket.emit('getRooms', roomList);
        } catch(error) {
            console.error(error)
        }
        // const room1 = socket.rooms
        // let room = Object.keys(room1).find(room =>{
        //     console.log('socket.id', socket.id)
        //     return room !== socket.id
        // })


        // // const rooms = io.of("/").adapter.rooms;
        // // const sids = io.of("/").adapter.sids;
        // // console.log('rooms', rooms)
        // // console.log('sids', sids)
    })

    socket.on('joinRoom', async (data) => {
        try {
            let result = await psql.joinRoom(data);
            const { roomId, userName, userId } = data;
            if (result) {
                io.emit('receive_message', {
                    text: `${userName} enters the room, Welcome 👏`,
                    name: userName,
                    id: '',
                    time: new Date(),
                    socketId: 'wsSystem',
                    roomId: roomId
                })
                let roomList = await psql.getRooms(userId);
                socket.emit('getRooms', roomList);
                socket.emit('addRoom', roomId);
            }
        } catch (error) {
            console.log('error', error);
            //TODO show error message
        }
    })

    socket.on('addRoom', async ({room, userName, userId}) => {
        try {
            let roomId = await psql.addRoom(userId, room);
            let roomList = await psql.getRooms(userId);
            if (roomId && roomList) {
                socket.join(roomId);
                //let socketId = socket.id;

                //everyone received
                //TODO
                io.sockets.in(room).emit('receive_message', {
                    text: `${userName} enters the room, Welcome 👏`,
                    name: userName,
                    id: '',
                    time: new Date(),
                    socketId: 'wsSystem',
                    roomId: room
                })
                socket.emit('getRooms', roomList);
                socket.emit('addRoom', roomId);
                
                // const sids = io.of("/").adapter.sids;
                // let array = [];

                // sids.get(socketId).forEach(item => {
                //     if (item !== socketId) array.push(item)
                // })
                
            }
        } catch (error) {
            console.error(error);
        }

        // socket.join(room)
        // let socketId = socket.id;

        // // everyone received except the user who just join the room
        // // socket.to(room).emit('addRoom', `${userId} Enter the room`)

        // //everyone received
        // io.sockets.in(room).emit('receive_message', {
        //     text: `${userName} enter the room`,
        //     name: userName,
        //     id: '',
        //     time: new Date(),
        //     socketId: 'wsSystem',
        //     roomId: room
        // })
        
        // const sids = io.of("/").adapter.sids;
        // let array = [];

        // sids.get(socketId).forEach(item => {
        //     if (item !== socketId) array.push(item)
        // })
        // socket.emit('getRooms', array)
    })

    socket.on('leaveRoom', async(data) => {
        try {
            await psql.leaveRoom(data);
            const { userName, userId, roomId } = data;
            socket.broadcast.emit('receive_message', {
                text: `${userName} leave the room`,
                name: userName,
                id: '',
                time: new Date(),
                socketId: 'wsSystem',
                roomId: roomId
            })

            let roomList = await psql.getRooms(userId);
            socket.emit('getRooms', roomList);
        } catch (error) {
            console.error(error)
        }
        //socket.leave(currentRoom);

        // let userId = socket.id;
        // socket.to(room).emit('leaveRoom', '有人離開（room 內除了當事人以外都收到）')
        // io.sockets.in(room).emit('leaveRoom', '有人離開（room 內所有人都收到）')

        // io.sockets.in(currentRoom).emit('receive_message', {
        //     text: `${userName} leave the room`,
        //     name: userName,
        //     id: '',
        //     time: new Date(),
        //     socketId: 'wsSystem',
        //     roomId: currentRoom
        // })

        // const sids = io.of("/").adapter.sids;
        // let array = [];
        // sids.get(userId).forEach(item => {
        //     if (item !== userId) array.push(item)
        // })

        // socket.emit('getRooms', array)
    })

    socket.on('disConnection', message => {
        const room = Object.keys(socket.rooms).find(room => {
            return room !== socket.id
        })

        let userId = socket.id;
        io.sockets.in(room).emit('receive_message', {
            text: `${userId} leave the room`,
            name: userId,
            time: new Date(),
            socketId: 'wsSystem',
            roomId: room
        })

        //先通知同一 room 的其他 Client
        //socket.to(room).emit('leaveRoom', `${message} 已離開聊天！`)
        //再送訊息讓 Client 做 .close() 
        socket.emit('disConnection', '')
    })

    //中斷後觸發此監聽
    socket.on('disconnect', () => {
        console.log('disconnection')
    })
})