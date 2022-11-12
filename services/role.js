import { buildErrorResponseData, buildResponse, buildUnAuthorizedResponse, getRequestString, getUserInfo } from "../utils/common.js";
import { httpCode, codes } from '../utils/const.js';
import logger from "./logger.js";
import { myPrisma } from '../models/index.js';
import config from '../config/index.js';

const adminId = config.admin.id;

const checkPermissionChatInRoom = (roomFieldName, location) => {
    return async (req, res, next) => {
        const roomId = parseInt(req[location][roomFieldName])
        const userInfo = getUserInfo(res)
        // Role is admin
        if (userInfo.id === adminId) {
            logger.Info(getRequestString(req), "Do request with admin role")
            return next();
        }

        const userOnRoom = await myPrisma.usersOnRoomChats.findFirst({
            where: {
                roomId: roomId,
                userId: userInfo.id,
            }
        })
        if (userOnRoom) {
            return next();
        }

        return buildResponse(
            res,
            httpCode.NOT_ALLOWED,
            buildErrorResponseData(codes.USER_NOT_IN_ROOM, "User not allowed within this room")
        )
    }
}

export default {
    middleWare: {
        checkPermissionChatInRoom
    }
}