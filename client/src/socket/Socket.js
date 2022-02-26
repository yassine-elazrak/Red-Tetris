const socket = (manager, event, data) => {
  return new Promise((resolve, reject) => {
    let io = manager.socket("/");
    
    if (!io.connected) {
      io.connect((err) => {
        if (err) {
          return reject(err.message);
        }
      });
    }
    io.emit(event, data, (res, err) => {
      if (err) {
        return reject(err.message);
      }
      resolve(res);
    });
    io.on("error", (err) => {
      reject(err.message);
    });
    io.on("connect_error", (err) => {
      reject(err.message);
    });
    io.on("connect_failed", (err) => {
      io.close();
      reject(err.message);
    });
    io.on("disconnect", (err) => {
      io.close();
      reject(err.message);
    });
  });
};

export default socket;
