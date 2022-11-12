import express from 'express';
import syncController from '../controllers/sync.js';
import authenticateService from '../services/authenticate.js';
import { wrapResponse } from './common.js';

const router = express.Router()
const handle = () => {
    // Sync data
    router.get(
        '/sync-data',
        authenticateService.middleWare.checkToken,
        wrapResponse(syncController.onSyncData),
    );
    
    return router
}

export default {
    handle
}