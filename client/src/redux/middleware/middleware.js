import socket from "../../socket/connection";

const middleware = (store) => (next) => (action) => {
  // let result = next(action);
  // console.log("middleware", store.getState());
  let io = store.getState().socket;

  console.log("middleware1", io.socket);
  if (!io.socket) {
    // if (!io.isConnecting) store.dispatch({ type: "LOADING_SOCKET" });
   
    socket()
      .then((socket) => {
        console.log("socket", socket);
        store.dispatch({
          type: "SOCKET_CONNECT",
          payload: socket,
        });
        next(action);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
    console.log("middleware2", store.getState());
  // return result;
};

export default middleware;
