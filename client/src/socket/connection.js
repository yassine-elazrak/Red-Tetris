import {Manager} from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

const initSocket = () => {
  //console.log("initSocket");
  return new Promise((resolve, reject) => {
    const manager = new Manager(ENDPOINT, {
      reconnection: false,
      autoConnect: false,
    });
    
    // const socket = manager.socket("/");

    resolve(manager);
    // manager.connect((err) => {
    //   if (err) {
    //     //console.log("err", err);
    //     return reject(err.message);
    //   }
    // });


    // socket.connect((err) => {
    //   if (err) {
    //     //console.log("err", err);
    //     return reject(err.message);
    //   }
    // });

    // socket.on("timeout", () => {
    //   //console.log("timeout");
    //   return reject("timeout");
    // });
    // socket.on("connect_error", (error) => {
    //   //console.log("connect_error", error);
    //   socket.close();
    //   return reject(error.message);
    // });
    // socket.on("connect_failed", (error) => {
    //   //console.log("connect_failed", error);
    //   socket.close();
    //   return reject(error.message);
    // });
    // socket.on("error", (error) => {
    //   //console.log("error", error);
    //   socket.close();
    //   return reject(error.message);
    // });

    // socket.on("connect", () => {
    //   //console.log("connect");
    //   resolve(manager);
    // });
  });
};

export default initSocket;
