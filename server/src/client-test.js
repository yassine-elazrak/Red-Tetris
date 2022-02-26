const io = require("socket.io-client");
console.log("start client")
let socket = io("http://localhost:5000");

socket.on("connection", (data) => {

   console.log("Message: ", data);
});