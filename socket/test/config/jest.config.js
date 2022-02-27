const Client = require('socket.io-client');
global.__io__ = require('socket.io')(global.__PORT__);

global.beforeAll((done) => {
    global.__io__.on("connection", (socket) => {
        global.__socketServer__ = socket;
        done();
    })
    global.__socketClient__ = Client(`${global.__URL__}:${global.__PORT__}/`);
})

global.afterAll(() => {
    global.__io__.close();
    global.__socketClient__.close();
})