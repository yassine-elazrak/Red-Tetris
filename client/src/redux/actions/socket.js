import socket from "../../socket/connection";
import { SOCKET_CONNECT, SOCKET_ERROR, LOADING_SOCKET } from "../types";


export const connect = () => {
  return async (dispatch) => {
    dispatch({ type: LOADING_SOCKET });
    try {
        console.log("connect");
        socket = await socket();
        dispatch(success(socket, SOCKET_CONNECT));
    } catch (err) {
      dispatch(error(err, SOCKET_ERROR));
    }
  };
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
