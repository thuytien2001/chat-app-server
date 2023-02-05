import { buildSuccessResponse, getUserInfo } from "../utils/common.js";
import { myPrisma } from "../models/index.js";

export default {
  onSyncData: async (req, res) => {
    var { lastSyncData } = req.query;

    lastSyncData = lastSyncData == null ? new Date(0) : new Date(lastSyncData);

    const userInfo = getUserInfo(res);
    var rooms = await myPrisma.roomChat.findMany({
      where: {
        OR: [
          {
            updatedAt: {
              gte: lastSyncData,
            },
          },
          {
            messages: {
              some: {
                createdAt: {
                  gte: lastSyncData,
                },
              },
            },
          },
        ],
      },
      include: {
        messages: {
          where: {
            createdAt: {
              gte: lastSyncData,
            },
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                imageUri: true,
              },
            },
          },
          orderBy: { id: "desc" },
        },
        users: {
          include: {
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
    });

    var roomsRes = rooms.map((room) => {
      var {users, ...roomRes} = {
        ...room,
        joiners: room.users,
      };
      return roomRes
    });

    return buildSuccessResponse(res, {
      totalItems: Object.keys(roomsRes).length,
      items: Object.values(roomsRes),
    });
  },
};
