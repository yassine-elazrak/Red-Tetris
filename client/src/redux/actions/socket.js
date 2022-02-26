import connect from "../../socket/connection";
import { SOCKET_CONNECT, SOCKET_ERROR, LOADING_SOCKET } from "../types";


export const socketConnet = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: LOADING_SOCKET });
      let socket = await connect();
      dispatch(success(socket, SOCKET_CONNECT));
    } catch (err) {
      dispatch(error(err, SOCKET_ERROR));
    }
  };
};

export const startSocket = () => {
  return (dispatch) => {
    dispatch({ type: 'startSocket' });
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
