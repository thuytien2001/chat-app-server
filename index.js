import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app)

app.get('/', (request, response) => {
    response.send('Hello, world!');
})

server.listen(8080, () => {
    console.log('Listening on port 8080');
});