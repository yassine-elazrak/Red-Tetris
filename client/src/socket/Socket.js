
const socket = (io, event, data) => {
  return new Promise((resolve, reject) => {
      io.emit(event, data, (res, err) => {
        if (err) {
          return reject(err.message);
        }
        return resolve(res);
      });
      console.log("socket", io);
  });
};

export default socket;
