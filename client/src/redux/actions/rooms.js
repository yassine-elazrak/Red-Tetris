import socket from "../../socket/Socket";
import {
  ROOMS_ERROR,
  ROOMS_LOADING,
  ROOMS_REFRESH,
} from "../types";




export const refreshRooms = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ROOMS_LOADING });
      const io = getState().socket.socket;
      const res = await socket(io, "currentRooms", null);
      dispatch(success(res, ROOMS_REFRESH));
    } catch (err) {
      dispatch(error(err, ROOMS_ERROR));
    }
  }
}



const success = (data, type) => {
  return {
    type: type,
    payload: data,
  };
};

const error = (data, type) => {
  return {
    type: type,
    payload: data,
  };
};