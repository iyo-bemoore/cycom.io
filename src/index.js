const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const messages = require("./config/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

io.on("connection", socket => {
  console.log("Connected to client");

  socket.emit("welcome", messages["welcome"]);
  socket.broadcast.emit("new_member", messages["new_member"]);

  socket.on("incoming", value => {
    io.emit("emitted", value);
  });

  socket.on("location", location => {
    io.emit(
      "link",
      `https://google.com/maps?q=${location.latitude},${location.longitude}`,
      "link"
    );
  });

  socket.on("disconnect", () => {
    io.emit("member_left", messages["member_left"]);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
