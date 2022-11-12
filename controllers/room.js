import config from '../config/index.js';
import { myPrisma } from '../models/index.js';
import { buildErrorResponseData, buildResponse, buildSuccessResponse, getUserInfo } from "../utils/common.js";
import { codes, httpCode } from '../utils/const.js';

const NUMBER_MESSAGE_PER_LOAD = config.room.numberMessagePerPage;

export default {
    onGetRoom: async (req, res) => {
        let {
            roomId
        } = req.query
        roomId = parseInt(roomId);
        const userInfo = getUserInfo(res);

        const room = await myPrisma.roomChat.findFirst({
            where: {
                id: roomId,
            },
            select: {
                id: true,
                name: true,
                messages: {
                    select: {
                        id: true,
                        content: true,
                        createdById: true,
                        createdAt: true,
                    },
                    orderBy: {
                        id: "desc"
                    },
                    take: NUMBER_MESSAGE_PER_LOAD,
                },
                avatarUri: true,
                createdAt: true,
                users: {
                    select: {
                        lastMessageSeenId: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                imageUri: true,
                            }
                        },
                    },
                },
            }
        })
        if (!room) {
            return buildResponse(
                res,
                httpCode.NOT_FOUND,
                buildErrorResponseData(codes.NOT_FOUND, "Not found room")
            )
        }

        return buildSuccessResponse(res, {
            id: room.id,
            name: room.name,
            avatarUri: room.avatarUri,
            createdAt: room.createdAt,
            maxNumberMessagePerPage: NUMBER_MESSAGE_PER_LOAD,
            lastMessages: room.messages?.map(message => {
                return {
                    id: message.id,
                    content: message.content,
                    createdById: message.createdById,
                    createdAt: message.createdAt,
                }
            }) ?? [],
            usersInRoom: room.users.map(userInRoom => {
                return {
                    id: userInRoom.user.id,
                    name: userInRoom.user.name,
                    imageUri: userInRoom.user.imageUri,
                }
            }) ?? [],
        })
    }
}