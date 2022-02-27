import { Manager } from "socket.io-client";

const initSocket = () => {
  return new Promise((resolve, reject) => {
    try {
      const manager = new Manager(
        process.env.REACT_APP_IO_ENDPOINT,
        {
          reconnection: false,
          autoConnect: false,
        });
      resolve(manager);
    } catch (e) {
      reject(e)
    }
  });
};

export default initSocket;
