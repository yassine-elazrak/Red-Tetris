const { Server } = require("socket.io");
const { createServer } = require("http");
const Users = require("./users/users");
const Rooms = require("./rooms/rooms");
const AuthMiddleware = require("./middleware/auth");


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
    const authMiddleware = new AuthMiddleware(this.io);
    this.server.listen(process.env.PORT || 5000, () => {
      console.log(`server is running on port ${process.env.PORT || 5000}`);
    });

    // this.io.of("/").on("connection", (socket) => {
    //   console.log(`user connected ${socket.id}`);
    // });

    // this.io.of("/auth").on("connection", (socket) => {
    //   console.log(`user connected ${socket.id}`);
    // });

    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);



      // // try to config middleware
      // socket.use((packet, next) => {
      //   console.log(`packet: ${packet[0]}`);
      //   next();
      // });

      socket.use(authMiddleware.auth(socket));




      socket.on("login", async (data, callback) => {
        console.log(`User ${socket.id} is trying to login`);
        try {
          let res = await users.login(socket.id, data);
          let allUsers = users.getUsers();
          socket.join('online');
          this.io.emit("updateUsers", allUsers);
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });

     

      socket.on("roomCreate", async (data, callback) => {
        console.log(`User ${socket.id} is trying to create a room`);
        try {
          let user = await users.getUser(socket.id);
          // console.log(user, "user");
          if (user.isJoned)
            return callback(null, { message: "You are already in a room" });
          let res = await rooms.createRoom(data, socket.id);
          await users.joinRoom(socket.id, res.name);
          let allUsers = users.getUsers();
          this.io.emit("updateUsers", allUsers);
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }
      });

      socket.on("closeRoom", async (room, callback) => {
        console.log(`User ${socket.id} is trying to close a room`);
        try {
          let res = await rooms.closeRoom(room, socket.id);
          // emit to all users in room
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });

      socket.on("onlineUsers", (data, callback) => {
        console.log(`User ${socket.id} is trying to get online users`);
        try {
          let res = users.getUsers();
          console.log(res, "res");
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        try {
          let user = users.getUser(socket.id);
          if (!user) return;
          if (user.isJoned) rooms.leaveRoom(socket.id, user.room);
          users.removeUser(socket.id);
          let allUsers = users.getUsers();
          this.io.emit("updateUsers", allUsers);
        } catch (error) {
          console.log(error, "error");
        }
      });
    });
  }
}

module.exports = new App().start();
