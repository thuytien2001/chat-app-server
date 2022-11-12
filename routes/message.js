import express from 'express';
import { chatController } from '../controllers/index.js';
import authenticateService from '../services/authenticate.js';
import roleService from '../services/role.js';
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

    return router
}

export default {
    handle
}