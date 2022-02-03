import { io } from "socket.io-client";

// const ENDPOINT = process.env.REACT_APP_IO_ENDPOINT || "http://localhost:5000";
const ENDPOINT = "http://localhost:5000";

const socket = (event, data) => {
    console.log("socket", data, event);
    return new Promise((resolve, reject) => {
        const socket = io(ENDPOINT, { reconnection: false });
        socket.on("connect", () => {
            resolve(socket);
        });
        socket.on("error", (err) => {
            reject(err);
        });
        socket.on("disconnect", (e) => {
            reject(("Disconnected"));
        });
        socket.on("reconnect_failed", (e) => {
            reject(("Reconnect Failed"));
        });
        socket.on("connect_error", (e) => {
            console.log(e, 'connect_error');
        reject(("Connect Error"));
        })
        socket.on("update", data => {
            console.log(data, 'update'); 
        });
        socket.emit(event, data);
    });
};

export default socket;
