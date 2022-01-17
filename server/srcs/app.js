
const router = require('./routes')
const dotenv = require("dotenv").config()
const http = require('http');
const express = require('express');
const swaggerUi = require('swagger-ui-express')
const socket = require('socket.io')
const logger = require('morgan');
// const swaggerFile = require('./swagger_output.json')
const {UsersService} = require('./users/user.service')


const app = express();
const server = http.createServer(app);
// const io = socket(server);
const io =  require('socket.io').listen(server)


io.on('connection', (socket) => {
    console.log('a user connected')
    socket.emit('message', 'welcome to the chat')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
    })

})

module.exports.createApp = () => {
    console.log('app up ')
    app.use(logger('dev'));
    app.use(express.json());
    app.use(router)
    // app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    return app;
};