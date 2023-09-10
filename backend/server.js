const express = require('express');
const app = express();

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

io.on('connection', socket => {
    console.log('server success connect!');
    

    socket.on('getRooms', () => {
        const room1 = socket.rooms
        let room = Object.keys(room1).find(room =>{
            console.log('socket.id', socket.id)
            return room !== socket.id
        })
        // const rooms = io.of("/").adapter.rooms;
        // const sids = io.of("/").adapter.sids;
        // console.log('rooms', rooms)
        // console.log('sids', sids)

        socket.emit('getRooms', room1)
    })

    socket.on("send_message", (data) => {
        console.log('send_message', data)
        io.emit("receive_message", data);
    })
    
    /*只回傳給發送訊息的 client*/
    socket.on('getMessage', message => {
        console.log('getMessages!', message)
        socket.emit('getMessage', message)
    })

    /*回傳給所有連結著的 client*/
    socket.on('getMessageAll', message => {
        io.emit('getMessageAll', message)
    })

    /*回傳給除了發送者外所有連結著的 client*/
    socket.on('getMessageLess', message => {
        socket.broadcast.emit('getMessageLess', message)
    })

    socket.on('addRoom', room => {
        socket.join(room)
        let userId = socket.id;

        // everyone received except the user who just join the room
        // socket.to(room).emit('addRoom', `${userId} Enter the room`)

        //everyone received
        io.sockets.in(room).emit('receive_message', {
            text: `${userId} enter the room`,
            name: userId,
            time: new Date(),
            socketId: 'wsSystem',
            roomId: room
        })
        
        const sids = io.of("/").adapter.sids;
        let array = [];

        sids.get(userId).forEach(item => {
            if (item !== userId) array.push(item)
        })
        socket.emit('getRooms', array)
    })

    socket.on('leaveRoom', room => {
        socket.leave(room);
        io.sockets.in(room).emit('receive_message', {
            text: `${userId} leave the room`,
            name: userId,
            time: new Date(),
            socketId: 'wsSystem',
            roomId: room
        })
        // socket.to(room).emit('leaveRoom', '有人離開（room 內除了當事人以外都收到）')
        // io.sockets.in(room).emit('leaveRoom', '有人離開（room 內所有人都收到）')

        let userId = socket.id;
        const sids = io.of("/").adapter.sids;
        let array = [];
        console.log('leave sids', sids)

        sids.get(userId).forEach(item => {
            if (item !== userId) array.push(item)
        })

        socket.emit('getRooms', array)
    })

    socket.on('disConnection', message => {
        console.log('hi', message)
        const room = Object.keys(socket.rooms).find(room => {
            return room !== socket.id
        })
        //先通知同一 room 的其他 Client
        socket.to(room).emit('leaveRoom', `${message} 已離開聊天！`)
        //再送訊息讓 Client 做 .close()
        socket.emit('disConnection', '')
    })

    //中斷後觸發此監聽
    socket.on('disconnect', () => {
        console.log('disconnection')
    })
})