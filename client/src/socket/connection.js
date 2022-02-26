import {Manager} from "socket.io-client";

const ENDPOINT = "192.168.1.114:5000";

const initSocket = () => {
  return new Promise((resolve, reject) => {
    const manager = new Manager(ENDPOINT, {
      reconnection: false,
      autoConnect: false,
    });
    resolve(manager);
  });
};

export default initSocket;
