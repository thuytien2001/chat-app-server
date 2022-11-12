import express from 'express';
import { roomController } from '../controllers/index.js';
import authenticateService from '../services/authenticate.js';
import roleService from '../services/role.js';
import { wrapResponse } from './common.js';

const router = express.Router()
const handle = () => {
    // GetRoom
    router.get('/get-room',
        authenticateService.middleWare.checkToken,
        wrapResponse(roleService.middleWare.checkPermissionChatInRoom('roomId', 'query')),
        wrapResponse(roomController.onGetRoom),
    )

    return router
}

export default {
    handle
}