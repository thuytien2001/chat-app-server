import { buildSuccessResponse, getUserInfo } from "../utils/common.js";
import { myPrisma } from "../models/index.js";
import { default as socketServer } from "../websocket/index.js";
import config from "../config/index.js";
import { Prisma } from "@prisma/client";

export default {
  onLoadRoom: async (req, res) => {
    var { roomId, beforeTime, pageSize } = req.query;

    roomId = parseInt(roomId);
    beforeTime = new Date(beforeTime);
    pageSize = parseInt(pageSize);
    if (pageSize > config.message.maxMessagePerPage) {
      // Check pageSize request is larger than maximum
      pageSize = config.message.maxMessagePerPage;
    }

    // Get messages
    const messages = await myPrisma.message.findMany({
      where: {
        roomId: roomId,
        createdAt: {
          lte: beforeTime,
        },
      },
      take: pageSize,
      orderBy: {
        id: "desc",
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
    });

    return buildSuccessResponse(res, {
      roomId: roomId,
      totalItems: messages.length,
      items: messages.map((message) => {
        return {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          createdBy: message.createdBy,
        };
      }),
    });
  },

  onSendMessage: async (req, res) => {
    const { content, roomId, localId } = req.body;
    const userInfo = getUserInfo(res);

    // Create message
    const message = await myPrisma.message.create({
      data: {
        content: content,
        roomId: roomId,
        createdById: userInfo.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            imageUri: true,
          },
        },
      },
    });

    var data = {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      createdById: message.createdById,
      createdBy: message.createdBy,
      roomId: message.roomId,
    };

    // Socket to specific room
    socketServer.emitMessageReceived(data);

    return buildSuccessResponse(res, {
      ...data,
      localId: localId, // New for localId
    });
  },

  async findMessage(content, roomId, offset, limit) {
    content = content.trim();
    const search_words = content.split(" ");
    const search_pattern = search_words.join(" | ");
    const message_props =
      '"id", "createdAt", "content", "createdById", "roomId"';
    const sql = `SELECT ${message_props}, ts_rank_cd(full_txt_search_idx, query) AS rank FROM "Message", to_tsquery(f_unaccent('${search_pattern}')) as query WHERE "roomId"=${roomId} AND query @@ full_txt_search_idx ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${offset};`;
    console.log("findMessage", { content, roomId, offset, limit, sql });
    const messageRes = await myPrisma.$queryRaw(Prisma.sql([sql]));

    const userRes = await myPrisma.user.findMany({
      where: {
        id: {
          in: messageRes.map((i) => i.createdById),
        },
      },
      select: {
        id: true,
        name: true,
        imageUri: true,
      },
    });
    const users = {};
    userRes.forEach((u) => {
      users[u.id] = u;
    });

    var messages = messageRes.map((m) => {
      return {
        ...m,
        createdBy: users[m.createdById],
      };
    });

    return messages
  },
};
