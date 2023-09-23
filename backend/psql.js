const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getRooms(userId) {
    let roomList = await sql`
        SELECT room_list FROM Users
        WHERE ${userId} = id;
    `
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

async function addRoom(userId, roomName) {
    let result = await sql`
        INSERT INTO Rooms 
        (
            room_name,
            createdDate
        )
        VALUES
        (
            ${roomName},
            ${new Date()}
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

async function joinRoom(userId, roomId) {
    await sql`
        UPDATE Users
        SET temp_hi = temp_hi - 2,  temp_lo = temp_lo - 2
        WHERE date > '1994-11-28';
    `
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
}) {
    const user = await sql`
        insert into Users
        (id, name, avatar_color, room_list, created_date)
        values
        (
            ${ id },
            ${ name },
            ${ avatar_color },
            //TODO: Fixed global room id
            ARRAY ['e8668385-4f5e-4da7-81f6-e5cb886ea0f2'],
            ${Date.now()}
        )
        returning id, name, avatar_color
    `
    return user
};

module.exports = { insertUser, getCurrentUser, addRoom, getRooms };