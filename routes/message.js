import express from 'express';
import { chatController } from '../controllers/index.js';
import authenticateService from '../services/authenticate.js';
import roleService from '../services/role.js';
import { buildSuccessResponse } from '../utils/common.js';
import { wrapResponse } from './common.js';

const router = express.Router()
const handle = () => {
    // LoadRoom
    router.get(
        '/load-room',
        authenticateService.middleWare.checkToken,
        wrapResponse(roleService.middleWare.checkPermissionChatInRoom('roomId','query')),
        wrapResponse(chatController.onLoadRoom),
    )
    // Send message
    router.post(
        '/send-message',
        authenticateService.middleWare.checkToken,
        wrapResponse(roleService.middleWare.checkPermissionChatInRoom('roomId','body')),
        wrapResponse(chatController.onSendMessage),
    )

    router.get(
        '/search',
        authenticateService.middleWare.checkToken,
        wrapResponse(roleService.middleWare.checkPermissionChatInRoom('roomId','query')),
        wrapResponse(async (req, res) => {
            const {
                content,
                roomId,
                offset = 0,
                limit = 20,
            } = req.query;
            const rs = await chatController.findMessage(content, roomId, offset, limit);
            return buildSuccessResponse(
                res, rs
            )
        }),
    )

    return router
}

export default {
    handle
}