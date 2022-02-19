import { LOADING_SOCKET, SOCKET_CONNECT, SOCKET_ERROR } from "../types";
import connect from "../../socket/connection";

const middleware = (store) => (next) => (action) => {
  let io = store.getState().socket;
  if (
    !io.socket &&
    !io.isLoading &&
    action.type !== SOCKET_CONNECT &&
    action.type !== SOCKET_ERROR &&
    action.type !== LOADING_SOCKET
  ) {
    store.dispatch({ type: LOADING_SOCKET });
    connect()
      .then((socket) => {
        ////console.log("socket connected");
        store.dispatch(success(socket, SOCKET_CONNECT));
        next(action);
      })
      .catch((err) => {
        ////console.log("socket error", err);
        next(error(err, SOCKET_ERROR));
      });
  } else if (
    io.socket ||
    action.type === SOCKET_CONNECT ||
    action.type === SOCKET_ERROR ||
    action.type === LOADING_SOCKET
  ) {
    next(action);
  }
};


const success = (data, type) => {
  return {
    type: type,
    payload: data,
  };
};

const error = (message, type) => {
  return {
    type: type,
    payload: message,
  };
};


export default middleware;
