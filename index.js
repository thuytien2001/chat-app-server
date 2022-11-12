import socketServer from './websocket/index.js';
import httpServer from './server/index.js';
import logger from './services/logger.js';

try {
    // Init server HTTP
    const server = httpServer.start(8080);

    // Init server Socket
    const mySocket = socketServer.start(server)
} catch (error) {
    logger.Error("Error server", error);
    throw error;
}


