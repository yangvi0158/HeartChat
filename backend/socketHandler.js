const psql = require('./psql');

module.exports = (io) => {
    const getUser = async function (userId, _self) {
        if (!userId) return;
        const socket = _self ? _self : this;
        try {
            let result = await psql.getCurrentUser(userId);
            socket.emit('getCurrentUser', result);
        } catch (error) {
            console.error('getUser Error', error)
            socket.emit('showSnackBar', {
                msg: error.message,
                status: 'error'
            })
        }
    };

    const addUser = async function (data) {
        if (!data) return;
        const socket = this;
        try {
            await psql.insertUser(data);

            /* update online user amount */
            let roomList = {};
            const roomsMap = io.of("/").adapter.rooms;
            for (let item of roomsMap) {
                roomList[item[0]] = Array.from(item[1]);
            }
            socket.broadcast.emit('updateOnlineUserAmount', roomList);
        } catch (error) {
            socket.emit('showSnackBar', {
                msg: error.message,
                status: 'error'
            })
        }
    }

    const updateUser = async function (data) {
        if (!data) return;
        const socket = this;
        try {
            await psql.updateUser(data)
            await getUser(data.id, this)
        } catch (error) {
            socket.emit('showSnackBar', {
                msg: error.message,
                status: 'error'
            })
        }
    }

    const getRooms = async function (userId, _self) {
        if (!userId) return;
        const socket = _self ? _self : this;
        try {
            let roomList = await psql.getRooms(userId);

            for (let room of roomList) {
                socket.join(room[0].room_id);
            }

            const rooms = io.of("/").adapter.rooms;
            for (let room of roomList) {
                room[0]['online_user_amount'] = rooms.get(room[0].room_id).size
            }
            socket.emit('getRooms', roomList);

        } catch(error) {
            socket.emit('showSnackBar', {
                msg: error.message,
                status: 'error'
            })
        }
    }

    const addRoom = async function ({room, userName, userId}) {
        const socket = this;
        try {
            let roomId = await psql.addRoom(userId, room);
            if (roomId) {
                socket.join(roomId);
                await getRooms(userId, this);

                //everyone received
                //TODO
                io.sockets.in(room).emit('receive_message', {
                    message_type: 'text',
                    is_system: true,
                    img_url: '',
                    room_id: roomId,
                    sender_name: '',
                    sender_id: '',
                    message: `${userName} enters the room, Welcome 👏`,
                    create_at: new Date(),
                })
                socket.emit('addRoom', roomId);
            }
        } catch (error) {
            socket.emit('showSnackBar', {
                msg: error.message,
                status: 'error'
            })
        }
    }

    const joinRoom = async function (data) {
        const socket = this;
        try {
            let result = await psql.joinRoom(data);
            const { roomId, userName, userId } = data;
            socket.join(roomId);

            if (result) {
                await getRooms(userId, this);

                io.emit('receive_message', {
                    message_type: 'text',
                    is_system: true,
                    img_url: '',
                    room_id: roomId,
                    sender_name: '',
                    sender_id: '',
                    message: `${userName} enters the room, Welcome 👏`,
                    create_at: new Date(),
                })
                socket.emit('addRoom', roomId);

                /* update online user amount */
                let roomList = {};
                const roomsMap = io.of("/").adapter.rooms;
                for (let item of roomsMap) {
                    roomList[item[0]] = Array.from(item[1]);
                }
                socket.broadcast.emit('updateOnlineUserAmount', roomList);
            }
        } catch (error) {
            socket.emit('showSnackBar', {
                msg: error.message,
                status: 'error'
            })
        }
    }

    const leaveRoom = async function (data) {
        const socket = this;
        try {
            await psql.leaveRoom(data);
            const { userName, userId, roomId } = data;

            socket.leave(roomId);
            socket.broadcast.emit('receive_message', {
                message_type: 'text',
                is_system: true,
                img_url: '',
                room_id: roomId,
                sender_name: '',
                sender_id: '',
                message: `${userName} leave the room`,
                create_at: new Date(),
                socketId: 'wsSystem',
            })

            await getRooms(userId, this);

            /* update online user amount */
            let roomList = {};
            const roomsMap = io.of("/").adapter.rooms;
            for (let item of roomsMap) {
                roomList[item[0]] = Array.from(item[1]);
            }
            socket.broadcast.emit('updateOnlineUserAmount', roomList);

        } catch (error) {
            socket.emit('showSnackBar', {
                msg: error.message,
                status: 'error'
            })
        }
    }

    const sendMessage = function (data) {
        io.emit("receive_message", data);
    }

    const enter = function () {
        let socket = this;
        let roomList = {};

        /* update online user amount */
        const roomsMap = io.of("/").adapter.rooms;
        for (let item of roomsMap) {
            roomList[item[0]] = Array.from(item[1])
        }

        socket.broadcast.emit('updateOnlineUserAmount', roomList);
    }

    // TODO: Remove this?
    const disConnection = function (data) {
        let socket = this;
        let roomList = {};

        /* update online user amount */
        const roomsMap = io.of("/").adapter.rooms;
        const socketId = socket.id;
        for (let item of roomsMap) {
            let userAmount = Array.from(item[1]).filter((room) => room !== socketId);
            if (userAmount.length) roomList[item[0]] = userAmount;
        }

        socket.broadcast.emit('updateOnlineUserAmount', roomList);

        // const room = Object.keys(socket.rooms).find(room => {
        //     return room !== socket.id
        // })

        //先通知同一 room 的其他 Client
        //socket.to(room).emit('leaveRoom', `${message} 已離開聊天！`)
        //再送訊息讓 Client 做 .close() 
        // socket.emit('disConnection', '')
    }

    return {
        getUser,
        addUser,
        updateUser,
        getRooms,
        addRoom,
        joinRoom,
        leaveRoom,
        sendMessage,
        disConnection,
        enter
    }
}