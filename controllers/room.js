import config from "../config/index.js";
import { myPrisma } from "../models/index.js";
import {
  buildErrorResponseData,
  buildResponse,
  buildSuccessResponse,
  getUserInfo,
} from "../utils/common.js";
import { codes, httpCode } from "../utils/const.js";

const NUMBER_MESSAGE_PER_LOAD = config.room.numberMessagePerPage;

export default {
  onGetRooms: async (req, res) => {
    let { roomId, pageSize, page } = req.query;
    roomId = parseInt(roomId) || 0;
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 1;
    const userInfo = getUserInfo(res);

    const isFindOne = roomId == null;

    const rooms = await myPrisma.roomChat.findMany({
      where: isFindOne
        ? { id: roomId }
        : {
            users: {
              some: {
                userId: userInfo.id,
              },
            },
          },
      include: {
        messages: {
          select: {
            id: true,
            content: true,
            roomId: true,
            createdBy: {
              select: {
                id: true,
                imageUri: true,
                name: true,
              },
            },
            createdAt: true,
          },
          orderBy: {
            id: "desc",
          },
          take: NUMBER_MESSAGE_PER_LOAD,
        },
        users: {
          select: {
            lastMessageSeenId: true,
            user: {
              select: {
                id: true,
                name: true,
                imageUri: true,
              },
            },
          },
        },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    if (!rooms.length && roomId) {
      return buildResponse(
        res,
        httpCode.NOT_FOUND,
        buildErrorResponseData(codes.NOT_FOUND, "Not found room")
      );
    }

    var roomsRes = rooms.map((room) => {
      var { users, ...roomRes } = {
        ...room,
        joiners: room.users.map(({ lastMessageSeenId, user }) => {
          return { ...user, lastMessageSeenId };
        }),
      };
      return roomRes;
    });

    return buildSuccessResponse(res, {
      totalItems: roomsRes.length,
      items: roomsRes,
    });
  },
};
