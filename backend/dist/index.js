"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 4000;
let content = "";
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log("following user connected ", socket.id);
    console.log(socket.data);
    socket.emit('receive_message', content);
    socket.on('send_message', (data) => {
        console.log("this is data and edited by: ", socket.id);
        console.log(data);
        content = data;
        io.emit("receive_message", data);
    });
    socket.on('disconnect', () => {
        console.log('this user disconnected: ', socket.id);
    });
});
app.get('/', (req, res) => {
    res.json({ msg: "this is the home route" });
});
server.listen(port, () => {
    console.log("the app is listning on the port ", port);
});
