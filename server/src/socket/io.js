const socketIo = require("socket.io");
const Users = require("../users/users");
const Rooms = require("../rooms/rooms");

class Socket {
  constructor(server) {
    this.io = socketIo(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
  }

  login = async (user, callback) => {

    console.log("login", user);

  }

  start = async () => {
    const users = new Users();

    
    this.io.of('/login').on("connection", (socket) => {
      console.log("A new user just connected");
      socket.on("login", (user, callback) => {


        console.log("login", user);
        let allUsers = users.getUsers();
        users
          .addNewUser(socket.id, user)
          .then((user) => {
            if (typeof callback === "function") {
              callback(
                {
                  name: user.name,
                  id: socket.id,
                  allUsers,
                },
                null
              );
            }
          })
          .catch((err) => {
            if (typeof callback === "function") {
              console.log("err", { err });
              callback(null, {message: err});
            }
          });
      });

      socket.on("disconnect", () => {
        users.removeUser(socket.id);
        console.log(`user disconnected ${socket.id}`);
        this.io.emit("updateUsers", users.getUsers());
      });
    });
    
    
    
    
    this.io.of('/room/create').use((socket, next) => {
      console.log('socket room', socket.handshake);
      if (users.getUser(socket.handshake.auth.id)) {
        return next();
      }
      return next(new Error('authentication error'));
    }).on('connection', (socket) => {
      console.log('connection to rome');
    });




  };
}

module.exports = Socket;
