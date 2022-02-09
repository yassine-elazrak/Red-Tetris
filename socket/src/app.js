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

      /********************** Auth ************************************/
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
          socket.join('online');
          console.log('online', this.io.sockets.adapter.rooms);
          this.io.emit("updateUsers", users.getUsers());
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });

      /**************************** Users ************************************/
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





      /************************** invitation **************************************/
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
          let currentUser = await users.getUser(socket.id);
          if (room.invit.findIndex((invit) => invit.userId === data.userId) !== -1)
            return callback(null, { message: "User already invited" });
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

          let notif = await users.userInvitation(user.id, {
            id: socket.id,
            name: currentUser.name,
            roomId: room.id,
            roomName: room.name,
            read: false,
          });
          this.io.to(user.id).emit("notification", notif);
          this.io.to(room.users).emit("updateRoom", room);
          if (typeof callback === "function") callback(res.invit, null);
        } catch (error) {
          console.log(error);
          if (typeof callback === "function") callback(null, error);
        }
      });


      /**
      * @description accept invitation
      * @param {string} event - acceptInvitation
      * @param {object} data - { roomId }
      * @param {function} callback - (room, err)
      */
      socket.on("acceptInvitation", async (data, callback) => {
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
      });



      /**
      * @description decline invitation
      * @param {string} event - declineInvitation
      * @param {object} data - { roomId }
      * @param {function} callback - (room, err)
      */
      socket.on("declineInvitation", async (data, callback) => {
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
      });

      /******************************** Rooms ***********************************/

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
          let allRooms = rooms.getRooms();
          let filterRoom = allRooms.map((room) => {
            return (
              (({ id, name, isPravite, admin, status }) => ({ id, name, isPravite, admin, status }))(room)
            )
          });
          callback(filterRoom, null);
        } catch (error) {
          if (typeof callback === "function") callback(null, error);
        }
      });


      /**
       * @description create new room
       * @param {string} event - createRoom
       * @param {object} data - { roomName, roomType }
       * @param {function} callback - (room, err)
       */
      socket.on("createRoom", async (data, callback) => {
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let user = await users.getUser(socket.id);
          if (user.isJoned)
            return callback(null, { message: "You are already in a room" });
          let res = await rooms.createRoom(data, socket.id);
          let userUpdate = await users.userJoin(socket.id, res.id);
          this.io.to(user.id).emit("updateProfile", userUpdate);
          this.io.emit("updateUsers", users.getUsers());
          this.io.emit("updateRooms", rooms.getRooms());
          if (typeof callback === "function") callback(res, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }

      });


      /**
       * @description join room
       * @param {string} event - joinRoom
       * @param {object} roomId - roomId
       * @param {function} callback - (room, err)
       */
      socket.on("joinRoom", async (roomId, callback) => {
        console.log(`User ${socket.id} is trying to join room ${roomId}`);
        if (!socket.rooms.has("online"))
          return callback(null, { message: "You are not authorized" });
        try {
          let user = await users.getUser(socket.id);
          if (user.isJoned) return callback(null, { message: "You are already in a room" });
          if (user.isJoned)
            return callback(null, { message: "You are already in a room" });
          let updateRoom = await rooms.joinRoom({ roomId, userId: socket.id });
          let updateProfile = await users.userJoin(socket.id, roomId);
          let res = (({ id, name, isPravite, admin, status }) => ({ id, name, isPravite, admin, status }))(updateRoom);
          this.io.to(user.id).emit("updateProfile", updateProfile);
          this.io.to(updateRoom.users).emit("userJoind", updateRoom);
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
          let user = await users.userLeave(socket.id);
          if (room.users.length === 0) {
            await rooms.deleteRoom(roomId);
            this.io.emit("updateRooms", rooms.getRooms());
          } else
            this.io.emit("updateRoom", room);
          this.io.to(user.id).emit("updateProfile", user);
          this.io.emit("updateUsers", users.getUsers());
          if (typeof callback === "function") callback(null, null);
        } catch (error) {
          console.log(error, "error");
          if (typeof callback === "function") callback(null, error);
        }
      });


      /*************************** Notifictions ************************************/

      /****************************** Game *****************************************/


      /***************************** Players ***************************************/


      /***************************** Chat ******************************************/

      /******************************* logout ***************************************/
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
