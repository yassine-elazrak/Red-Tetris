const { Server } = require("socket.io");
const { createServer } = require("http");
const Users = require("./users/users");
const Rooms = require("./rooms/rooms");

require("dotenv").config();

class App {
  constructor() {
    this.server = createServer();
    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
  }

  start() {
    const users = new Users();
    const rooms = new Rooms();
    this.server.listen(process.env.PORT || 5000, () => {
      console.log(`server is running on port ${process.env.PORT || 5000}`);
    });
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("login", async (data, callback) => {
        try {
          let res = await users.login(socket.id, data);
          // console.log(res, "res");
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });

      socket.on("roomCreate", async (data, callback) => {
        try {
          let user = await users.getUser(socket.id);
          console.log(user, "user");
          if (user.isJoned)
            return callback(null, { message: "You are already in a room" });
          let res = await rooms.createRoom(data, socket.id);
          await users.joinRoom(socket.id, res.name);
          console.log(res, "resroom");
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }
      });


      socket.on("closeRoom", async (room, callback) => {

        try {
          let res = await rooms.closeRoom(room, socket.id);
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }


      });


      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        users
          .removeUser(socket.id)
          .then((res) => {
            this.io.emit("updateUsers", res);
          })
          .catch((err) => {
            console.log(err, "err");
          });
      });
    });
  }
}

module.exports = new App().start();
