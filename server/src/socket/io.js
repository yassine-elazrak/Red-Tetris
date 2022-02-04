const socketIo = require("socket.io");
const Users = require("../users/users");

class Socket {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
  }

  start = async () => {
    const users = new Users();
    
    this.io.on("connection", (socket) => {
      console.log("A new user just connected");
      /**
       * listen new user login
      */
      socket.on("login", (user, callback) => {
        console.log("login", user);
        let allUsers = users.getUsers();
        users.addNewUser(socket.id, user)
          .then((user) => {
            if (typeof callback === "function") {
              callback({
                name: user.name,
                id: socket.id,
                allUsers,
              }, null);
            }
          })
          .catch((err) => {
            if (typeof callback === "function") {
              console.log("err", err);
              callback(null, err);
            }
          });
      });

      /**
       * create new room or join room
       * args: {
       * name: '',
       * room: ''
       * }
       * callback: (error, user) => {}
       * */


      socket.on("disconnect", () => {
        users.removeUser(socket.id);
        console.log(`user disconnected ${socket.id}`);
        this.io.emit("updateUsers", users.getUsers());
      });


    });
  };
}

module.exports = Socket;
