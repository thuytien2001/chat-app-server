import express from 'express';
import { chatController } from '../controllers/index.js';
import authenticateService from '../services/authenticate.js';
import { wrapResponse } from './common.js';

const router = express.Router()
const handle = () => {
    // LoadRoom
    router.get(
        '/load-room',
        authenticateService.middleWare.checkToken,
        wrapResponse(chatController.onLoadRoom),
    )
    // Send message
    router.post(
        '/send-message',
        authenticateService.middleWare.checkToken,
        wrapResponse(chatController.onSendMessage),
    )

    return router
}

export default {
    handle
}