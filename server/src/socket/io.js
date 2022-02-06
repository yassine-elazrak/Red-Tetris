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
  };

  start = async () => {
    const users = new Users();
    const rooms = new Rooms();

    /**
     * User namespace
     **/
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
      socket.on("login", (user, callback) => {
        // console.log("login", socket.id);
        users
          .addNewUser(socket.id, user)
          .then((user) => {
            if (typeof callback === "function") {
              callback(
                {
                  name: user.name,
                  id: socket.id,
                },
                null
              );
            }
          })
          .catch((err) => {
            if (typeof callback === "function") {
              console.log("err", { err });
              callback(null, { message: err });
            }
          });
      });

      // socket.on("rooms",  (callback) => {
      //   console.log("rooms", socket.id);
      // });

      socket.on("disconnect", () => {
        users.removeUser(socket.id);
        console.log(`user disconnected ${socket.id}`);
        this.io.emit("updateUsers", users.getUsers());
      });
    });

    /**
     * Room namespace
     **/
    this.io
      .of("/room")
      .use((socket, next) => {
        let user = users.getUser(socket.handshake.auth.id);
        if (user) {
          if (user.isJoined)
            return next(new Error("you are already joined in other room"));
          return next();
        }
        return next(new Error("authentication error"));
      })
      .on("connection", (socket) => {
        socket.on("create", (room, callback) => {
          socket.join(room.name);
          socket.to(room.name).emit("rooms", `new user user joined`);
          console.log("create room", socket.id);
          callback(
            {
              name: room,
              id: socket.id,
              user: users.getUser(socket.id),
            },
            null
          );
        });

        socket.on("disconnect", () => {
          console.log(`user disconnected room ${socket.id}`);
        });
      });
  };
}

module.exports = Socket;
