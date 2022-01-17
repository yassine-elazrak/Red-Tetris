// const logger = require('morgan');
// const { createApp } = require('./app')
// const port = process.env.PORT || 3000;
// const app = createApp();
// app.listen(port, () =>
//     console.log(`Server is running!\nAPI documentation: http://localhost:${port}/doc`)
// );

const express = require('express');
const socketIo = require('socket.io')
const http = require('http');
const app = express()
;
const server = http.createServer(app);

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const io = socketIo(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials:true
    }
  });

io.on('connection', (socket) => {
    console.log('a user connected')
    // socket.emit('message', 'welcome to the chat')
    
    // socket.on('disconnect', () => {
    //     console.log('user disconnected')
    // })
    // socket.on('chat message', (msg) => {
    //     console.log('message: ' + msg)
    // })

})
 
server.listen(5000);

