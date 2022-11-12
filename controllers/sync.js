import { buildSuccessResponse, getUserInfo } from "../utils/common.js";
import { myPrisma } from '../models/index.js';

export default {
    onSyncData: async (req, res) => {
        var {
            lastSyncData
        } = req.query;

        lastSyncData = new Date(lastSyncData)

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
                    }
                },
            }
        })
        return buildSuccessResponse(res, {
            totalItems: messages.length,
            items: messages.map(message => {
                return {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    createdBy: message.createdBy,
                    room: message.room,
                }
            })
        });
    }
}