// const express = require("express");
// const socketIo = require("./socket/io");
// const http = require("http");
// const app = express();

// require('dotenv').config();


// class App {
//   server = null;
  
<<<<<<< HEAD
  constructor() {
    this.server = http.createServer(app);
    this.io = new socketIo(this.server);
    this.io.start();
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
    app.get("/", (request, response) => {
      console.log("request", request);
      response.send("Hello World");
    });
    this.server.listen(process.env.PORT || 5000, () => {
      console.log(`server is running on port ${process.env.PORT || 5000}`);
    });
  }
}
=======
//   constructor() {
//     this.server = http.createServer(app);
//     this.io = new socketIo(this.server);
//     this.io.start();
//     app.use((request, response, next) => {
//       response.header("Access-Control-Allow-Origin", "*");
//       response.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//       );
//       next();
//     });
//   }
//   start() {
//     this.server.listen(process.env.PORT || 5000, () => {
//       console.log(`server is running on port ${process.env.PORT || 5000}`);
//     });
//   }
// }
>>>>>>> 36a43c7fb2f8b860295b94020dc9eb3c9a865a75

// let server = new App();
// server.start();
