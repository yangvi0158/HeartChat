const express = require('express');
const app = express();

const server = require('http').Server(app)
    .listen(8000, '0.0.0.0', () => {
        var host = server.address().address
        var port = server.address().port
        console.log('open server!', 'host:', host, 'port', port)
    })

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://heart-chat.com',
        methods: ["GET", "POST"]
    }
})

app.get('/test-connection', function (req, res) {
    res.send('Connected!');
});

const {
    getUser,
    addUser,
    getRooms,
    addRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    disConnection,
    enter
} = require('./socketHandler')(io)

io.on('connection', async(socket) => {
    console.log('server success connect');
    socket.on('getUser', getUser);
    socket.on('addUser', addUser);
    socket.on('getRooms', getRooms);
    socket.on('addRoom', addRoom);
    socket.on('joinRoom', joinRoom);
    socket.on('leaveRoom', leaveRoom);
    socket.on('sendMessage', sendMessage)
    //中斷後觸發此監聽
    socket.on('disconnection', disConnection);
    socket.on('enter', enter);

    
    //socket.on('disconnect', disconnect)
    
    /*只回傳給發送訊息的 client*/
    // socket.emit('getMessage', message)

    /*回傳給所有連結著的 client*/
    // io.emit('getMessageAll', message)

    /*回傳給除了發送者外所有連結著的 client*/
    // socket.broadcast.emit('getMessageLess', message)
})