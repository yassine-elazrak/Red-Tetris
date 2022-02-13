import socket from "../../socket/Socket";
import { SUCESS_LOGIN, LOADING_USER, FAIL_LOGIN, UPDATE_PROFILE } from "../types";

export const login = (user) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_USER });
      const io = getState().socket.socket;
      const res = await socket(io, "login", user);
      dispatch(success(res, SUCESS_LOGIN));
    } catch (err) {
      dispatch(error(err, FAIL_LOGIN));
    }
  };
};

export const updateUser = (user) => {
  return (dispatch) => {
    dispatch(success(user, UPDATE_PROFILE));
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
