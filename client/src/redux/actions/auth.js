import socket from "../../socket/Socket";
import { SUCESS_LOGIN, LOADING_USER, FAIL_LOGIN } from "../types";

export const login = (user) => {
  return async (dispatch) => {
    dispatch({ type: LOADING_USER });
    // try {
    //   const res = await socket("user", "login", user);
    //   dispatch(success(res, SUCESS_LOGIN));
    // } catch (err) {
      dispatch(error('test', FAIL_LOGIN));
    // }
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
