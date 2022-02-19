import io from "socket.io-client";

const ENDPOINT = "192.168.1.114:5000";

export default io(ENDPOINT);