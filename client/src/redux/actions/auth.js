import socket from "../../socket/Socket";
import { SUCESS_LOGIN, LOADING_USER, FAIL_LOGIN, UPDATE_USER } from "../types";

export const login = (user) => {
  return async (dispatch, getState) => {
    dispatch({ type: LOADING_USER });
    try {
      const io = getState().socket.socket;
      const res = await socket(io, "login", user);
      dispatch(success(res, SUCESS_LOGIN));
    } catch (err) {
      console.log(err);
      dispatch(error(err, FAIL_LOGIN));
    }
  };
};

export const updateUser = (user) => {
  return (dispatch) => {
    dispatch(success(user, UPDATE_USER));
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
