const express = require("express");
const socketIo = require("./socket/io");
const http = require("http");
const app = express();

class Sever {
  constructor() {
    this.server = http.createServer(app);
    this.io = new socketIo(this.server);
    app.use((request, response, next) => {
      response.header("Access-Control-Allow-Origin", "*");
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
  }
  start() {
    this.server.listen(5000, () => {
      console.log("server is running on port 5000");
    });
  }
}

let server = new Sever();
server.start();
