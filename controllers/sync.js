import { buildSuccessResponse, getUserInfo } from "../utils/common.js";
import { myPrisma } from "../models/index.js";

export default {
  onSyncData: async (req, res) => {
    var { lastSyncData } = req.query;

    var syncTime = new Date(!lastSyncData ? 0 : lastSyncData);

    const userInfo = getUserInfo(res);
    var rooms = await myPrisma.roomChat.findMany({
      where: {
        OR: [
          {
            updatedAt: {
              gte: syncTime.toISOString(),
            },
          },
          {
            messages: {
              some: {
                createdAt: {
                  gte: syncTime.toISOString(),
                },
              },
            },
          },
        ],
        AND: [
          {
            users: {
              some: {
                userId: userInfo.id
              }
            }
          }
        ]
      },
      include: {
        messages: {
          where: {
            createdAt: {
              gte: syncTime.toISOString(),
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
    });

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
      totalItems: Object.keys(roomsRes).length,
      items: Object.values(roomsRes),
    });
  },
};
