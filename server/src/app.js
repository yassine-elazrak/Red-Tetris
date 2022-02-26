const express = require("express");
const {Server} = require("socket.io");
const http = require("http");
const app = express();

require('dotenv').config();


class BaseServer {
  constructor() {
    console.log("class Base");
    this.server = http.createServer(app);
    this.io = new Server(this.server);
  }
}

class BaseSocket extends BaseServer {
  constructor() {
    super();
    console.log("class BaseSocket");
  }
  events() {

    //event for connection
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id} , ${socket}`);
      socket.use((socket, next) => {
        console.log("middleware");
        next();
      });
    });

    //event for login
    this.io.on("login", (socket) => {
      console.log(`User login: ${socket.id}`);
    }
    );
    //event for logout
    this.io.on("logout", (socket) => {
      console.log(`User logout: ${socket.id}`);
    }
    );
    //event join to room
    this.io.on("join", (socket) => {
      console.log(`User join: ${socket.id}`);
    }
    );
    //event Start game
    this.io.on("startGame", (socket) => {
      console.log(`User start game: ${socket.id}`);
    }
    );
    //event for disconnect
    this.io.on("disconnect", (socket) => {
      console.log(`User disconnected: ${socket.id}`);
    }
    );
    ///event for send message
    this.io.on("sendMessage", (socket) => {
      console.log(`User send message: ${socket.id}`);
    }
    );
    //event stop game
    this.io.on("stopGame", (socket) => {
      console.log(`User stop game: ${socket.id}`);
    }
    );
    //event for send message
  

  }
}

class App extends BaseSocket{
  constructor() {
    super();
    console.log("class App");
  }
  runner() {
    this.events();
    this.server.listen(process.env.PORT || 5000, () => {
      console.log(`server is running on port ${process.env.PORT || 5000}`);
    });
  }
}

module.exports = new App();