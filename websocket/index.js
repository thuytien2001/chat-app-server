'use strict';
import {Server} from "socket.io";

// Event get from user client
const CLIENT_EVENT = {
    ONLINE: 'online',
};

// Event to emit for user client
const SERVER_EVENT = {
    RECEIVE_MESSAGE: 'receive_message',
};

const activeUsers = new Map();

const onConnection = (client) => {
    console.log("User is connected, session id: " + client.id);
    // Online
    client.on(CLIENT_EVENT.ONLINE, data => handleOnline(client, data));
}

const handleOnline = (client, data) => {
}

export default function initSocket(httpServer) {
    const io = new Server(httpServer);
    io.on("connection", onConnection)
};