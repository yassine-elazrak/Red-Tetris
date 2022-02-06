import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

export default io(ENDPOINT);