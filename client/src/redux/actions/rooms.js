import socket from "../../socket/Socket";
import {
    ROOMS_ERROR,
    ROOMS_LOADING,
    ROOMS_REFRESH,
} from "../types";




export const refreshRooms = () => {
    return async (dispatch, getState) => {
        dispatch({ type: ROOMS_LOADING });
        try {
            const io = getState().socket.socket;
            const res = await socket(io, "currentRooms", null);
            dispatch(success(res, ROOMS_REFRESH));
        } catch (error) {
            dispatch(error(error, ROOMS_ERROR));
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