const socket = (manager, event, data) => {
  return new Promise((resolve, reject) => {
    let io = manager.socket("/");
    console.log(`socket ${io.connected}`);
    
    if (!io.connected) {
      console.log("socket not connected", io.io);
      io.connect((err) => {
        console.log("socket connect", err);
        if (err) {
          console.log("err", err);
          return reject(err.message);
        }
      });
    }
    io.emit(event, data, (res, err) => {
      if (err) {
        console.log("err", err);
        return reject(err.message);
      }
      console.log(`socket ${event}, ${data}`, res);
      resolve(res);
    });
    io.on("error", (err) => {
      console.log("error", err);
      reject(err.message);
    });
    io.on("connect_error", (err) => {
      console.log("connect_error", err);
      reject(err.message);
    });
    io.on("connect_failed", (err) => {
      console.log("connect_failed", err);
      io.close();
      reject(err.message);
    });
  });
};

export default socket;
