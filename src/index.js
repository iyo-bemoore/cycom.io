const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {
  generateMessages,
  generateLocationMessage
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", socket => {
  console.log("New WebSocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit(
      "message",
      generateMessages(`Welcome ${user.username}`, "Admin")
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessages(`${user.username} has joined!`, "Admin")
      );
    io.to(user.room).emit("roomStatus", {
      room: user.room,
      users: getUsersInRoom(user.room)
    });
    callback();
  });

  socket.on("typing", data => {
    const { user, error } = getUser(socket.id);
    if (data.typing === true) {
      socket.broadcast.to(user.room).emit("display", data);
    } else {
      socket.broadcast.to(user.room).emit("display", data);
    }
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    const { user, error } = getUser(socket.id);
    if (error) {
      callback(error);
    }

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    }

    io.to(user.room).emit("message", generateMessages(message, user.username));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const { user, error } = getUser(socket.id);
    if (error) {
      callback(error);
    }
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        user.username
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessages(`${user.username} has left!`)
      );
      io.to(user.room).emit("roomStatus", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
