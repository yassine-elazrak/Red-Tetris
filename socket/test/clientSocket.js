const Client = require('socket.io-client');
const socketClient = new Client('http://localhost:5000');

    beforeAll((done) => {
        socketClient.on('connect', done);
    })

    afterAll(() => {
        socketClient.close();
    })

    const PromiseConnection = (event, data) => {
        return new Promise((resolve, reject) => {
            socketClient.emit(event, data, (res, err) => {
                if (err) {
                    return reject(err.message);
                }
                resolve(res);
            });
            socketClient.on("error", (err) => {
                reject(err.message);
            });
            socketClient.on("connect_error", (err) => {
                reject(err.message);
            });
            socketClient.on("connect_failed", (err) => {
                socketClient.close();
                reject(err.message);
            });
            socketClient.on("disconnect", (err) => {
                socketClient.close();
                reject(err.message);
            });
        })
    }

module.exports = PromiseConnection;