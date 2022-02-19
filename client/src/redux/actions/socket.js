import connect from "../../socket/connection";
import { SOCKET_CONNECT, SOCKET_ERROR, LOADING_SOCKET } from "../types";


export const socketConnet = () => {
  return async (dispatch) => {
    // dispatch({ type: LOADING_SOCKET });
    try {
      dispatch({ type: LOADING_SOCKET });
      let socket = await connect();
      // ////console.log("socket", socket);
      dispatch(success(socket, SOCKET_CONNECT));
    } catch (err) {
      // ////console.log("err", err);
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
