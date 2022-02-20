const Client = require('socket.io-client');
const socketClient = new Client('http://localhost:5000');

// describe('Socket.io', () => {
    beforeAll((done) => {
        socketClient.on('connect', done);
    })

    afterAll(() => {
        socketClient.close();
    })
// })

module.exports = socketClient;