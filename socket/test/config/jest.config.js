const Client = require('socket.io-client');
global.__io__ = require('socket.io')(3337);


global.beforeAll((done) => {
    global.__socketClient__ = Client('http://localhost:3337');
    global.__io__.on("connection", (socket) => {
        global.__socketServer__ = socket;
        // console.log('beforeAll config')
        done();
    })
})

global.afterAll(() => {
    global.__io__.close();
    global.__socketClient__.close();
    // console.log('afterAll config')
})