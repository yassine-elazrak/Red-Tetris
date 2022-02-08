const { Server } = require("socket.io");
const { createServer } = require("http");
const Users = require("./users/users");
const Rooms = require("./rooms/rooms");
const AuthMiddleware = require("./middleware/auth");
const { wrap } = require("module");


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







    // this.io.use(wrap(authMiddleware.auth));


    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);


      socket.on("login", async (data, callback) => {
        console.log(`User ${socket.id} is trying to login`);
        try {
          let res = await users.login(socket.id, data);
          let allUsers = users.getUsers();
          socket.join('online');
          // console.log('online', socket.rooms);
          console.log('online', this.io.sockets.adapter.rooms);
          this.io.emit("updateUsers", allUsers);
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });


      socket.on("onlineUsers", async (_, callback) => {
        console.log(`User ${socket.id} is trying to get online users`);
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let res = users.getUsers();
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });


      socket.on("roomCreate", async (data, callback) => {
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let user = await users.getUser(socket.id);
          // console.log(user, "user");
          if (user.isJoned)
            return callback(null, { message: "You are already in a room" });
          let res = await rooms.createRoom(data, socket.id);
          await users.joinRoom(socket.id, res.id);

          let allUsers = users.getUsers();
          this.io.emit("updateUsers", allUsers);
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }

      });

      socket.on("closeRoom", async (roomId, callback) => {
        console.log(`User ${socket.id} is trying to close a room`);
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let res = await rooms.closeRoom(roomId, socket.id);
          this.io.emit("updateRooms", rooms.getRooms());
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });

      socket.on("leaveRoom", async (roomId, callback) => {
        console.log(`User ${socket.id} is trying to leave a room`);
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let room = await rooms.leaveRoom(socket.id, roomId);
          let user = await users.leaveRoom(socket.id);
          let allUsers = users.getUsers();
          if (room.users.length === 0) {
            await rooms.deleteRoom(roomId);
            this.io.emit("updateRooms", rooms.getRooms());
          } else
            this.io.emit("updateRoom", room);
          socket.emit("updateProfile", user);
          this.io.emit("updateUsers", allUsers);
          if (typeof callback === "function") callback(null, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }
      });



      socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.id}`);
        try {
          let user = await users.getUser(socket.id);
          if (user.isJoned) {
            let room = await rooms.leaveRoom(socket.id, user.room);
            if (room.users.length === 0) {
              let currntRooms = await rooms.deleteRoom(room.id);
              this.io.emit("updateRooms", currntRooms);
            }
          }
          let allUsers = await users.logout(socket.id);
          this.io.emit("updateUsers", allUsers);
        } catch (error) {
          console.log(error, "error");
        }
      });
    });
  }
}

module.exports = new App().start();
