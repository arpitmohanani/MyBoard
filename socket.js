const express = require("express");
const socket = require("socket.io");

const application = express();

application.use(express.static("application"));

let port = 2000;
let server = application.listen(port,()=>{
    console.log("Listening to port: " + port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection");

    socket.on("beginPath", (data) => {
        io.sockets.emit("beginPath", data);
    })

    socket.on("drawStroke", (data) =>{
        io.sockets.emit("drawStroke", data);
    })

    socket.on("redoUndo", (data) =>{
        io.sockets.emit("redoUndo", data);
    })
})
