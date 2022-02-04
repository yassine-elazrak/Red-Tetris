import { io } from "socket.io-client";
import axios from "axios";

// const ENDPOINT = process.env.REACT_APP_IO_ENDPOINT || "http://localhost:5000";
const ENDPOINT = "http://localhost:5000";

const socket = (event, data) => {
  return new Promise((resolve, reject) => {
    const manager = io(ENDPOINT);
    manager.on("timeout", () => {
      return reject("timeout");
    });
    manager.on("connect_error", (error) => {
    //   console.log("connect_error", error);
      manager.close();
      return reject(error.message);
    });
    manager.on("connect_failed", (error) => {
    //   console.log(error, "failed");
      manager.close();
      return reject(error.message);
    });
    manager.on("error", (error) => {
      console.log(error, "error");
      manager.close();
      return reject(error.message);
    });

    manager.on("connect", () => {
      manager.emit(event, data, (res) => {
        return resolve(res);
      });
    });
  });
};

export default socket;
