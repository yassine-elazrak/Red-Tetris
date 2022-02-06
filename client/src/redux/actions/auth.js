import socket from "../../socket/Socket";
import { SUCESS_LOGIN, LOADING_USER, FAIL_LOGIN } from "../types";
import { useSelector } from "react-redux";

export const login = (user) => {
  return async (dispatch, getState) => {
    const io = getState().socket.socket;
    dispatch({ type: LOADING_USER });
    try {
      const res = await socket(io, "login", user);
      dispatch(success(res, SUCESS_LOGIN));
    } catch (err) {
      dispatch(error(err, FAIL_LOGIN));
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
