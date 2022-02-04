const socketIo = require("socket.io");

class Socket {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        // credentials: true,
      },
    });

    this.io.on("connection", (socket) => {
      console.log("A new user just connected");

      /**
       * create new user
       **/
      socket.on("login", (user, callback) => {
        console.log("login", user);
        socket.join("usersOnline");
        if (typeof callback === "function") {
            let allUsrs = Array.from(this.io.sockets.adapter.rooms.get("usersOnline"));
          callback({
            name: user,
            id: socket.id,
            users: allUsrs,
          });
        }
      });

      /**
       * create new room
       */

        socket.on("create", (args, callback) => {


        });

        /**
         * join room
         **/

        socket.on("join", (args, callback) => {
            console.log(args);

        });


    });
  }
}

module.exports = Socket;
