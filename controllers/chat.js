import { buildSuccessResponse, getUserInfo } from "../utils/common.js";
import { myPrisma } from '../models/index.js';
import { default as socketServer } from '../websocket/index.js';
import config from "../config/index.js";

export default {
    onLoadRoom: async (req, res) => {
        var {
            roomId,
            beforeTime,
            pageSize,
        } = req.query;

        roomId = parseInt(roomId);
        beforeTime = new Date(beforeTime);
        pageSize = parseInt(pageSize);
        if (pageSize > config.message.maxMessagePerPage) { // Check pageSize request is larger than maximum
            pageSize = config.message.maxMessagePerPage
        }

        // Get messages
        const messages = await myPrisma.message.findMany({
            where: {
                roomId: roomId,
                createdAt: {
                    lte: beforeTime,
                }
            },
            take: pageSize,
            orderBy: {
                id: 'desc'
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        return buildSuccessResponse(res, {
            roomId: roomId,
            totalItems: messages.length,
            items: messages.map(message => {
                return {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    createdBy: message.createdBy,
                }
            }),
        });
    },

    onSendMessage: async (req, res) => {
        const {
            content,
            roomId,
            localId,
        } = req.body;
        const userInfo = getUserInfo(res)

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