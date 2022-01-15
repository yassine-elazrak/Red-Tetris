// const logger = require('morgan');
// const { createApp } = require('./app')
// const port = process.env.PORT || 3000;
// const app = createApp();
// app.listen(port, () =>
//     console.log(`Server is running!\nAPI documentation: http://localhost:${port}/doc`)
// );

// const app = require('express')();
// const server = require('http').createServer(app);
// const socketIo = require('socket.io')

// app.use((request, response, next) => {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// const io = socketIo(server,{
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       credentials:true
//     }
//   });
// io.on('connection', (socket) => {
//     console.log('a user connected')
//     socket.emit('message', 'welcome to the chat')
    
//     socket.on('disconnect', () => {
//         console.log('user disconnected')
//     })
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg)
//     })

// })
// server.listen(3000);


const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
              origin: "*",
              methods: ["GET", "POST"],
              credentials:true
            }
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);