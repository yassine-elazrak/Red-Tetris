const io = require('socket.io')(2337);
const Client = require('socket.io-client');
let serverSocket, clientSocket;

const befor = () => {
    return new Promise((resolve, reject) => {
        clientSocket = Client("http://localhost:2337");
        io.of('/').on("connection", (socket) => {
            serverSocket = socket;
            resolve({ io, serverSocket, clientSocket });
        });
        io.of('/').on("error", (err) => {
            clientSocket.close();
            reject(new Error("socket not connected"));
        });
    });
}

const after = () => {
    io.close();
    clientSocket.close();
}

module.exports = { befor, after };