import express from 'express';
import { chatController } from '../controllers/index.js';
import authenticateMiddleware from './middleware/authenticate.js';

const router = express.Router()
const handle = () => {
    // LoadRoom
    router.get(
        '/load-room',
        authenticateMiddleware.checkToken,
        chatController.onLoadRoom,
    )

    return router
}

export default {
    handle
}