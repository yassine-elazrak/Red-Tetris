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

      /**
       * @description Create new user
       * @param {string} event - login
       * @param {object} data - { username }
       * @param {function} callback - (user, err)
       */
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

      /**
       * @description get online users
       * @param {string} event - onlineUsers
       * @param {object} data - null
       * @param {function} callback - (users, err)
       */
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


      /**
       * @description get all rooms
       * @param {string} event - currentRooms
       * @param {object} data - null
       * @param {function} callback - (rooms, err)
       */
      socket.on("currentRooms", async (_, callback) => {
        console.log(`User ${socket.id} is trying to get current rooms`);
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let res = rooms.getRooms();
          callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });


      /**
       * @description invite user to room 
       * @param {string} event - newInvetation
       * @param {object} data - { roomId, userId }
       * @param {function} callback - (listUsersInvets, err)
       */
      socket.on("invitation", async (data, callback) => {
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let room = await rooms.getRoom(data.roomId);
          let user = await users.getUser(data.userId);
          let currentUser = users.getUser(socket.id);
          if (room.invit.findIndex((invit) => invit.userId === data.userId) !== -1)
            return callback(null, { message: "User already invited" });
          console.log(room, 'room', room.status);
          if (user.isJoned)
            return callback(null, { message: `${user.name} is already in room` });
          if (room.status !== "waiting")
            callback(null, { message: "Room is closed2" });
          if (room.admin !== socket.id)
            callback(null, { message: "You are not admin" });
          let res = await rooms.inviteUser({
            roomId: data.roomId,
            userId: user.id,
            userName: user.name,
            userStatus: "waiting",
          });

          await users.invitation(user.id, {
            id: currentUser.id,
            name: currentUser.name,
            roomId: room.id,
            read: false,
          });
          this.io.to(user.id).emit("notification", {
            id: currentUser.id,
            name: currentUser.name,
            roomId: room.id
          });
          this.io.to(room.users).emit("updateRoom", room);
          if (typeof callback === "function") callback(res.invit, null);
        } catch (error) {
          console.log(error);
          if (typeof callback === "function") callback(null, error);
        }
      });

      /**
       * @description create new room
       * @param {string} event - roomCreate
       * @param {object} data - { roomName, roomType }
       * @param {function} callback - (room, err)
       */
      socket.on("roomCreate", async (data, callback) => {
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let user = await users.getUser(socket.id);
          let allUsers = users.getUsers();
          if (user.isJoned)
            return callback(null, { message: "You are already in a room" });
          let res = await rooms.createRoom(data, socket.id);
          let userUpdate = await users.joinRoom(socket.id, res.id);
          let allRooms = rooms.getRooms();
          this.io.to(user.id).emit("updateProfile", userUpdate);
          this.io.emit("updateUsers", allUsers);
          this.io.emit("updateRooms", allRooms);
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }

      });

      /**
       * @description close room
       * @param {string} event - closeRoom
       * @param {object} data - roomId
       * @param {function} callback - (room, err)
       */
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

      /**
       * @description leave room
       * @param {string} event - leaveRoom
       * @param {object} data - roomId
       * @param {function} callback - (null, err)
       */
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
          this.io.to(user.id).emit("updateProfile", user);
          this.io.emit("updateUsers", allUsers);
          if (typeof callback === "function") callback(null, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }
      });

      /**
       * @description disconnect user
       * @param {string} event - disconnect
       */
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
