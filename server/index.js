import express from 'express';
import http from 'http';
import bodyParser from "body-parser";

const app = express();
const server = http.createServer(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static("public")); // show images and files in 'public' directory

// Router
app.get('/', (request, response) => {
    response.send('Hello, world!');
})
// app.use("/", indexRouter);
// app.use("/sync", syncRouter);
// app.use("/user", userRouter);
// Catch 404 and forward to error handler
app.use("*", (req,res) => {
    return res.status(404).json({
        code: 404,
        message: "Not found route",
    })
})

export function initServer(port) {
    server.listen(port, () => {
        console.log('Listening on port ' + port);
    });
}