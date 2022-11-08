import {Server} from "socket.io";

// Event get from user client
const CLIENT_EVENT = {
    SYCN_DATA: 'sync_data',
    DISCONNECT: 'disconnect',
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
    // Sync data
    client.on(CLIENT_EVENT.SYCN_DATA, data => handleSyncData(client, data));
    // Disconnect
    client.on(CLIENT_EVENT.DISCONNECT, data => handleDisconnect(client, data));
}

const handleOnline = (client, data) => {
}

const handleSyncData = (client, data) => {
}

const handleDisconnect = (client, data) => {
}

export default function initSocket(httpServer) {
    const io = new Server(httpServer);
    io.on("connection", onConnection)
};