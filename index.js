import socketServer from './websocket/index.js';
import httpServer from './server/index.js';

// Init server HTTP
const server = httpServer.start(8080);

// Init server Socket
const mySocket = socketServer.start(server)
