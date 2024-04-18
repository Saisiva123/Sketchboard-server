const express = require('express');
const { createServer } = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const routes = require("./routes/index");
const passport = require("passport")
const { connectToDb } = require("./database/connectToDb");
require('./utils/passportSetup');

require('dotenv').config({
    path: path.join(__dirname, `.env.${process.env.NODE_ENV}`)
});

const app = express();
const httpServer = createServer(app);
const io = socketIo(httpServer, {
    cors: {
        origin: '*'
    }
});
let socketConnections = [];
connectToDb();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(session({
    secret: '1234_56789_abcd_0987',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

io.on("connection", (socket) => {
    const { roomId, username } = socket.handshake.query;
    
    if (roomId && username) {
        if (socketConnections?.length) {  
            socketConnections.map(connections => {
                if (connections.room.id == roomId) {
                    if (!connections.room.sockets.map(socketDetails => socketDetails.socketUserName)?.includes(username)) {
                        connections.room.sockets.push({ socketUserName: username, socket })
                        socket.join(roomId);
                        socket.broadcast.to(roomId).emit('joined', username);
                    }
                    else {
                        let existedUser = connections.room.sockets.find(socketDetails => socketDetails.socketUserName == username);
                        existedUser.socket.leave(roomId);
                        existedUser.socket.disconnect();
                        socket.join(roomId)
                        connections.room.sockets.find(socketDetails => socketDetails.socketUserName == username).socket = socket   
                    }
                }
                
            })
            if(socketConnections.some(conn => conn.room.id != roomId))
            {
                socket.join(roomId);
                socketConnections.push({ room: { id: roomId, sockets: [{ socketUserName: username, socket }] } })
            }
        }
        else {
            socket.join(roomId);
            socketConnections.push({ room: { id: roomId, sockets: [{ socketUserName: username, socket }] } })
        }

        socket.on('board_changes', (data) => {
            socket.broadcast.to(data.roomId).emit('state', data.state);
        })

        socket.on('room_events', (data) => {
            socket.broadcast.to(data.roomId).emit('room_events', data.message);
        })

        socket.on('disconnect_socket', (data) => {
            console.log("Disconnect isnvoked", socket.id);
            socket.broadcast.to(data.roomId).emit('left', data.username);
            
            // remove the socket form storage
            socketConnections.find(connection => connection.room.id == data.roomId).room.sockets  =
            socketConnections.find(connection => connection.room.id == data.roomId).room.sockets.filter(conn => conn.socket.id != socket.id );
            
            // remove the room from storage if no socket exisits)
            socketConnections = socketConnections.filter(conn => conn.room.sockets.length)
            // console.log(socketConnections)
            socket.disconnect()
        })

        socket.on('disconnect', () => {
            console.log("Socket Disconnected")
        })
    }

});




app.use((err, req, res, next) => {
    res.status(500).json({ err: err.message, message: "Something went wrong." })
})

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});