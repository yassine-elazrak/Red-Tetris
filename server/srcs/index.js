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
const { UsersService } = require('./users/user.service')

const server = http.createServer(app);
const {isRealString} = require('./utils/isRealString');

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


/**
* event listener for new connection
* join the room
* send the message to the room
* leave the room
* disconnect
* create a new room
*  notification to user 
**/

io.on('connection', (socket) => {

  console.log("A new user just connected");

  /**
   * create new room or join room
   */
  socket.on('join',(args, callback) => {
    /**
     * args: {
     *  name: '',
     * room: ''
     * }
     * callback: (error, user) => {}
     */
    console.log(args)
    if(!isRealString(args.name) || !isRealString(args.room)){
      return callback('Name and room are required');
    }
    const { error, user } = addUser({ id: socket.id, ...args });
    if (error) {
    }
    /*
    * join the room
    * send the message to all user room except the sender
    */
    socket.broadcast.emit('message', `new user ${args.name} joined`);
  })

  /**
   * create a new message
   *  emit the message to the room
   */
   
  socket.on('createMessage', (message, callback) => {
    console.log(message)
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {'user.name': message});
    }
    callback();
  })

  /**
   * disconnect from the room
   * leave the room
   */

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) 
      io.to(user.room).emit('message', `${user.name} has left ${user.room}  room.`);
  })

  /**
   * end code socket
   */
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})
 
server.listen(5000);

