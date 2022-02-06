import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

const socket = () => {
  return new Promise((resolve, reject) => {
    const manager = io(ENDPOINT);
    manager.on("timeout", () => {
      return reject("timeout");
    });
    manager.on("connect_error", (error) => {
      manager.close();
      return reject(error.message);
    });
    manager.on("connect_failed", (error) => {
      manager.close();
      return reject(error.message);
    });
    manager.on("error", (error) => {
      manager.close();
      return reject(error.message);
    });

    manager.on("connect", () => {
      resolve(manager);
    });
  });
};

export default socket;
