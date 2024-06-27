const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getGlobalRoomIdList() {
    const globalRoomIdList = await sql`
        SELECT room_id FROM rooms
        WHERE is_global = TRUE;
    `
    return globalRoomIdList.map(item => (item.room_id).toString())
}


async function getRooms(userId) {
    let roomList = await sql`
        SELECT room_list FROM Users
        WHERE ${userId} = id;
    `

    if (roomList[0]?.room_list.length) {
        let result = [];
        for(let id of roomList[0].room_list) {
            let item = await sql`
                SELECT * FROM Rooms
                WHERE room_id = ${id}
            `
            result.push(item)
        }
    
        return result;   
    }
}

async function leaveRoom({userId, roomId}) {
    await sql`
        UPDATE Users
    SET room_list =  array_remove(
            room_list,
            ${roomId}
        )
        WHERE id = ${userId};
    `
}

async function addRoom(userId, roomName) {
    let result = await sql`
        INSERT INTO Rooms 
        (
            room_name,
            is_global
        )
        VALUES
        (
            ${roomName},
            false
        )
        returning room_id, room_name
    `

    if (result) {
        await sql`
            UPDATE Users
            SET room_list = array_append(
                room_list,
                ${result[0].room_id}
            )
            WHERE id = ${userId};
        `
        return result[0].room_id;
    }

}

async function joinRoom({userId, roomId}) {
    let room = await sql`
        SELECT room_name FROM ROOMS
        WHERE room_id = ${roomId}
    `
    if (!room.length) throw new Error('Cannot find this room');

    let roomList = await sql`
        SELECT room_list FROM Users
        WHERE ${userId} = id;
    `
    let alreadyHasRoom = roomList[0].room_list.some((item) => item === roomId);
    if (alreadyHasRoom) throw new Error('You have already in this room')

    const result = await sql`
    UPDATE Users
    SET room_list = array_append(
        room_list,
        ${roomId}
    )
    WHERE id = ${userId};
    `   
    return {result, room}
}


async function getCurrentUser(userId) {
    const result = await sql`
        select * FROM Users
        WHERE ${userId} = id
    `
    return result
}

async function insertUser({
    id,
    name,
    avatar_color,
    has_img,
    description,
    img_id = ''
}) {
    const globalRoomIdList = await getGlobalRoomIdList();
    const globalRoomListString = `{${globalRoomIdList.map(id => `${id}`).join(',')}}`;

    const user = await sql`
        insert into Users
        (id, name, avatar_color, has_img, room_list, description, img_id)
        values
        (
            ${ id },
            ${ name },
            ${ avatar_color },
            ${ has_img },
            ${ globalRoomListString },
            ${ description },
            ${ img_id }
        )
        returning id, name, avatar_color
    `.catch(error => console.error('insertUser Error', error))
    return user
};

async function updateUser({
    name,
    avatar_color,
    has_img,
    description,
    img_id = '', 
    id
}) {
    try {
        const query = (!has_img || (img_id && has_img)) ? sql`
            update users
            set
                name = ${name},
                avatar_color = ${avatar_color},
                has_img = ${has_img},
                description = ${description},
                img_id = ${img_id}
            where id = ${id}
        ` : sql`
            update users
            set
                name = ${name},
                avatar_color = ${avatar_color},
                has_img = ${has_img},
                description = ${description}
            where id = ${id}
        `

        const user = await query;
    } catch (error) {
        console.error('updateUser Error', error)
    }
}

module.exports = {
    insertUser,
    updateUser,
    getCurrentUser,
    addRoom,
    joinRoom,
    getRooms,
    leaveRoom,
};