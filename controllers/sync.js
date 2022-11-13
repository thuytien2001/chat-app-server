import { buildSuccessResponse, getUserInfo } from "../utils/common.js";
import { myPrisma } from '../models/index.js';

export default {
    onSyncData: async (req, res) => {
        var {
            lastSyncData
        } = req.query;

        lastSyncData = lastSyncData === null ? null : new Date(lastSyncData)

        const userInfo = getUserInfo(res)
        const messages = await myPrisma.message.findMany({
            where: {
                createdAt: {
                    gte: lastSyncData
                },
                room: {
                    users: {
                        some: {
                            userId: userInfo.id
                        }
                    }
                },
            },
            orderBy: {
                id: 'asc',
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                createdBy: {
                    select: {
                        id: true,
                        imageUri: true,
                        name: true,
                    }
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                        users: true,
                    }
                },
            }
        })

        var rooms = {};
        messages.forEach(message => {
            const messageInRoom = {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                createdBy: {
                    id: message.createdBy.id,
                    imageUri: message.createdBy.imageUri,
                    name: message.createdBy.name,
                },
            }
            if (!rooms[message.room.id]) {
                rooms[message.room.id] = {
                    id: message.room.id,
                    name: message.room.name,
                    messages: [
                        messageInRoom
                    ],
                }
            } else {
                rooms[message.room.id].messages = [...rooms[message.room.id].messages, messageInRoom]
            }
        })

        return buildSuccessResponse(res, {
            totalItems: Object.keys(rooms).length,
            items: Object.values(rooms),
        });
    }
}