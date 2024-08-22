import express from "express"
import { Server } from "socket.io";
import http from "http"
import cors from 'cors'


const app = express();
app.use(cors())

const port = 4000
let content = ""
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log("following user connected ", socket.id)
    console.log(socket.data)

    socket.emit('receive_message', content)
    socket.on('send_message', (data) => {
        console.log("this is data and edited by: ", socket.id)
        console.log(data)
        content = data

        io.emit("receive_message", data)
    })


    socket.on('disconnect', () => {
        console.log('this user disconnected: ', socket.id)
    })
})

app.get('/', (req, res) => {
    res.json({ msg: "this is the home route" })
})


server.listen(port, () => {
    console.log("the app is listning on the port ", port)
})