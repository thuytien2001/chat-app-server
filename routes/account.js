import express from 'express';
import { accountController } from '../controllers/index.js';
import { wrapResponse } from './common.js';

const router = express.Router()
const handle = () => {
    // Login
    router.get('/login', wrapResponse(accountController.onLogin))

    return router
}

export default {
    handle
}