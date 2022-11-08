import webSocket from './websocket/index.js';
import { initServer } from './server/index.js';

// Init server HTTP
initServer(8080);

// Init server Socket
let socket = new webSocket(8081)
