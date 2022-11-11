import { buildSuccessResponse } from "../utils/common.js";
import { codes, httpCode } from "../utils/const.js";
import { myPrisma } from '../models/index.js';
import { default as socketServer, SERVER_EVENT } from '../websocket/index.js';

export default {
    onLoadRoom: async (req, res) => {
        return buildSuccessResponse(
            res,
            {}
        )
    },

    onSendMessage: async (req, res) => {
        const {
            content,
            roomId,
            localId,
        } = req.body;
        const userInfo = res.locals.user

        // Create message
        const message = await myPrisma.message.create({
            data: {
                content: content,
                roomId: roomId,
                createdById: userInfo.id
            },
        })

        // Socket to specific room
        socketServer.emitMessageReceived(
            {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                createdById: message.createdById,
                roomId: message.roomId,
            },
        )

        return buildSuccessResponse(res, {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            createdById: message.createdById,
            roomId: message.roomId,
            localId: localId, // New for localId
        });
    },
};