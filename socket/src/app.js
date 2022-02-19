const { Server } = require("socket.io");
const { createServer } = require("http");
// const Users = require("./users/users");
// const Rooms = require("./rooms/rooms");
const Middleware = require("./middleware/auth");
const AuthController = require("./controller/authController");
const UsersController = require("./controller/usersController");
const InviteController = require("./controller/inviteController");
const RoomsController = require("./controller/roomsController");
const MessagesController = require("./controller/messagesController");

require("dotenv").config();

class App {
  constructor() {
    this.server = createServer();
    this.io = new Server(this.server, {
      cors: {
        // origin: "http://localhost:3000",
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.AuthController = new AuthController(this.io);
    this.UsersController = new UsersController(this.io);
    this.InviteController = new InviteController(this.io);
    this.RoomsController = new RoomsController(this.io);
    this.MessagesController = new MessagesController(this.io);
  }

  start() {
    // const users = new Users();
    // const rooms = new Rooms();
    const AuthMiddleware = new Middleware();
    this.server.listen(process.env.PORT || 5000, () => {
      ////console.log(`server is running on port ${process.env.PORT || 5000}`);
    });


    this.io.on("connection", (socket) => {
      ////console.log(`User connected: ${socket.id}`);
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
      socket.on("invitation", this.InviteController.invitation(socket));


      /**
      * @description accept invitation
      * @param {string} event - acceptInvitation
      * @param {object} data - { roomId }
      * @param {function} callback - (room, err)
      */
      socket.on("acceptInvitation", this.InviteController.changeStatusInvitation(socket, "accepted"));

      /**
      * @description decline invitation
      * @param {string} event - declineInvitation
      * @param {object} data - { roomId }
      * @param {function} callback - (room, err)
      */
      socket.on("declineInvitation", this.InviteController.changeStatusInvitation(socket, "decline"));

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
      socket.on("createRoom", this.RoomsController.createRoom(socket));


      /**
       * @description join room
       * @param {string} event - joinRoom
       * @param {object} roomId - roomId
       * @param {function} callback - (room, err)
       */
      socket.on("joinRoom", this.RoomsController.joinRoom(socket))


      socket.on("createOrJoin", this.RoomsController.createOrJoinRoom(socket))




      /**
       * @description close room
       * @param {string} event - closeRoom
       * @param {object} data - roomId
       * @param {function} callback - (room, err)
       */
      // socket.on("closeRoom", this.RoomsController.changeStatusRoom(socket, 'closed'));
      socket.on("changeStatusRoom", this.RoomsController.changeStatusRoom(socket));

      /**
       * @description leave room
       * @param {string} event - leaveRoom
       * @param {object} data - roomId
       * @param {function} callback - (null, err)
       */
      socket.on("leaveRoom", this.RoomsController.leaveRoom(socket))


      /*************************** Notifictions **********************************/

      /****************************** Game ************************************/

      socket.on("gameActions", this.RoomsController.gameAction(socket))
      socket.on("continueGame", this.RoomsController.gameContinue(socket))


      /***************************** Players ***********************************/


      /***************************** Chat *************************************/
      socket.on("sentMessage", this.MessagesController.sentMessage(socket));
      /******************************* logout **********************************/
      /**
       * @description disconnect user
       * @param {string} event - disconnect
       */
      socket.on("disconnect", this.AuthController.logout(socket));
      socket.on("error", (error) => {
        socket.emit("error", { message: error.message });
      });


    });
  }
}

module.exports = new App().start();
