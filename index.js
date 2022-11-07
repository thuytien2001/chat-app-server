import { initSocket } from './websocket/index.js';
import { initServer } from './server/index.js';

// Init server HTTP
initServer(8080);

// Init server Socket
initSocket(8081)