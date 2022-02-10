const { Server } = require("socket.io");
const { createServer } = require("http");
// const Users = require("./users/users");
// const Rooms = require("./rooms/rooms");
const Middleware = require("./middleware/auth");
const AuthController = require("./controller/authController");
const UsersController = require("./controller/usersController");
const InviteController = require("./controller/inviteController");
const RoomsController = require("./controller/roomsController")

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
    this.AuthController = new AuthController(this.io);
    this.UsersController = new UsersController(this.io);
    this.InviteController = new InviteController(this.io);
    this.RoomsController = new RoomsController(this.io);
  }

  start() {
    // const users = new Users();
    // const rooms = new Rooms();
    const AuthMiddleware = new Middleware();
    this.server.listen(process.env.PORT || 5000, () => {
      console.log(`server is running on port ${process.env.PORT || 5000}`);
    });


    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // console.log('this socket', this);
      socket.use(AuthMiddleware.auth(socket));

      /********************** Auth ************************************/
      /**
       * @description Create new user
       * @param {string} event - login
       * @param {object} data - { username }
       * @param {function} callback - (user, err)
       */
      socket.on("login", this.AuthController.login(socket));


      /**************************** Users ************************************/
      /**
       * @description get online users
       * @param {string} event - onlineUsers
       * @param {object} data - null
       * @param {function} callback - (users, err)
       */
      socket.on("onlineUsers", this.UsersController.onlineUsers());





      /************************** invitation **************************************/
      /**
       * @description invite user to room 
       * @param {string} event - newInvetation
       * @param {object} data - { roomId, userId }
       * @param {function} callback - (listUsersInvets, err)
       */
      socket.on("invitation",this.InviteController.invitation(socket));


      /**
      * @description accept invitation
      * @param {string} event - acceptInvitation
      * @param {object} data - { roomId }
      * @param {function} callback - (room, err)
      */
      socket.on("acceptInvitation", async (data, callback) => {
        // if (!socket.rooms.has("online"))
        //   return callback(null, { message: "You are not authorized" });
      });



      /**
      * @description decline invitation
      * @param {string} event - declineInvitation
      * @param {object} data - { roomId }
      * @param {function} callback - (room, err)
      */
      socket.on("declineInvitation", async (data, callback) => {
        // if (!socket.rooms.has("online"))
        //   return callback(null, { message: "You are not authorized" });
      });

      /******************************** Rooms ***********************************/

      /**
       * @description get all rooms
       * @param {string} event - currentRooms
       * @param {object} data - null
       * @param {function} callback - (rooms, err)
       */
      socket.on("currentRooms", this.RoomsController.currentRoom());


      /**
       * @description create new room
       * @param {string} event - createRoom
       * @param {object} data - { roomName, roomType }
       * @param {function} callback - (room, err)
       */
      socket.on("createRoom", this.RoomsController.createRoom(socket.id));


      /**
       * @description join room
       * @param {string} event - joinRoom
       * @param {object} roomId - roomId
       * @param {function} callback - (room, err)
       */
      socket.on("joinRoom", this.RoomsController.joinRoom(socket.id))




      /**
       * @description close room
       * @param {string} event - closeRoom
       * @param {object} data - roomId
       * @param {function} callback - (room, err)
       */
      socket.on("closeRoom", this.RoomsController.closeRoom(socket.id));

      /**
       * @description leave room
       * @param {string} event - leaveRoom
       * @param {object} data - roomId
       * @param {function} callback - (null, err)
       */
      socket.on("leaveRoom", this.RoomsController.leaveRoom(socket.id))


      /*************************** Notifictions ************************************/

      /****************************** Game *****************************************/


      /***************************** Players ***************************************/


      /***************************** Chat ******************************************/

      /******************************* logout ***************************************/
      /**
       * @description disconnect user
       * @param {string} event - disconnect
       */
      socket.on("disconnect", this.AuthController.logout(socket));
      socket.on("error", (error) => {
        console.log(`Error: ---> ${error.message}`);
        socket.emit("error", { message: error.message});
      });


    });
  }
}

module.exports = new App().start();
