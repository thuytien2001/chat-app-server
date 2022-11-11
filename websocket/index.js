'use strict';
import { Server } from "socket.io";
import { myPrisma } from "../models/index.js";
import authenticateService from '../services/authenticate.js';
import logger from "../services/logger.js";

// Event get from user client
const CLIENT_EVENT = {
    ONLINE: 'online',
};

// Event to emit for user client
export const SERVER_EVENT = {
    RECEIVE_MESSAGE: 'receive_message',
};

const onConnection = (client) => {
    logger.Info("Socket", "User is connected, session id: " + client.id);
    // Online
    client.on(CLIENT_EVENT.ONLINE, data => handleOnline(client, data));
}

const handleOnline = (client, data) => {
    const {
        token,
    } = data;

    try {
        const userInfo = authenticateService.verifyToken(token);
        client.join(userInfo.id)
        logger.Info("handleOnline", "Join successful, userId: " + userInfo.id);
    } catch (error) {
        logger.Error("handleOnline", error.message)
    }
}

let io = new Server();
io.on("connection", onConnection)

export default {
    start: (httpServer) => {
        io.listen(httpServer)
        logger.Info('Socket server listening on: ' + JSON.stringify(httpServer.address()));
        return io
    },
    emit: (roomId, eventName, data) => io.to(roomId).emit(eventName, data),
    emitMessageReceived: async (data) => {
        const {
            roomId
        } = data;

        // Find all user in room
        const usersInRoom = await myPrisma.usersOnRoomChats.findMany({
            where: {
                roomId: roomId,
            },
            select: {
                user: true
            }
        })

        // Emit data
        for (const userInRoom of usersInRoom) {
            io.to(userInRoom.user.id).emit(SERVER_EVENT.RECEIVE_MESSAGE, data)
        }
        logger.Info("emitMessageReceived", "Emit success, userIds: " + usersInRoom.map(userInRoom => userInRoom.user.id));
    },
}