const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes/UserRouts");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// load env credential
dotenv.config();
app.use(
  cors({
    origin: "*", // * from any host
    methods: "GET,POST",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/", (req, res) => {
  console.log("first");
  const date = new Date();
  console.log(date.toLocaleTimeString());
  res.send("hello");
});

const roomCreator = new Map(); // roomid => socketid

io.on("connection", function (socket) {
  console.log(" socket connection", socket.id);

  // Room Creation
  socket.on("createRoom", (data) => {
    const roomId = data;
    console.log(roomId);
    socket.join(roomId); // Joining the socket to the newly created room
    const totalRoomUsers = io.sockets.adapter.rooms.get(roomId);
    socket.emit("roomCreated", {
      roomId,
      totalConnectedUsers: Array.from(totalRoomUsers || []),
    });
    roomCreator.set(roomId, socket.id); // Storing room creator information
    socket.roomId = roomId; // Attach roomId to socket
  });

  // Joining a Room
  socket.on("joinRoom", (data) => {
    const roomExists = io.sockets.adapter.rooms.has(data.roomId);
    if (roomExists) {
      socket.join(data.roomId); // Joining the client socket to the specified room
      socket.roomId = data.roomId; // Attach roomId to socket
      const creatorSocketID = roomCreator.get(data.roomId);
      if (creatorSocketID) {
        const creatorSocket = io.sockets.sockets.get(creatorSocketID);
        if (creatorSocket) {
          const totalRoomUsers = io.sockets.adapter.rooms.get(data.roomId);
          creatorSocket.emit("userJoinedRoom", {
            userId: socket.id,
            totalConnectedUsers: Array.from(totalRoomUsers || []),
          });
        }
      }
      io.to(`${socket.id}`).emit("roomJoined", {
        status: "OK",
      });
    } else {
      io.to(`${socket.id}`).emit("roomJoined", {
        status: "ERROR",
      });
    }
  });

  // Leaving a Room
  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (roomId) {
      if (roomCreator.get(roomId) === socket.id) {
        const roomUsers = io.sockets.adapter.rooms.get(roomId);
        if (roomUsers) {
          for (const socketId of roomUsers) {
            io.to(`${socketId}`).emit("roomDestroyed", {
              status: "OK",
            });
          }
        }
        io.sockets.adapter.rooms.delete(roomId);
        roomCreator.delete(roomId);
      } else {
        socket.leave(roomId);
        const creatorSocketId = roomCreator.get(roomId);
        if (creatorSocketId) {
          const creatorSocket = io.sockets.sockets.get(creatorSocketId);
          if (creatorSocket) {
            creatorSocket.emit("userLeftRoom", {
              userId: socket.id,
              totalConnectedUsers: Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
              ),
            });
          }
        }
      }
    }
  });


  socket.on("location", (roomId, locationData) => {
    console.log(locationData);
    console.log(roomId);
    io.to(roomId).emit(`location`, locationData);
  });
  socket.on("disconnect", function () {
    console.log("disconnected");
  });
});

module.exports = { http, io };
