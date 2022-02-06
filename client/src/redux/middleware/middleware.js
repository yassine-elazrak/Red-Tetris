import {
  LOADING_SOCKET,
  SOCKET_CONNECT,
  SOCKET_ERROR,
} from "../types";

const middleware = (store) => (next) => (action) => {
  let io = store.getState().socket;

  console.log("middleware1", action);
  if (
    !io.socket &&
    action.type !== SOCKET_CONNECT &&
    action.type !== LOADING_SOCKET &&
    action.type !== SOCKET_ERROR
    )  {
    return next( { type: "SOCKET_ERROR", payload: "socket is not connected" } );
  }
  else return next(action);
};

export default middleware;
