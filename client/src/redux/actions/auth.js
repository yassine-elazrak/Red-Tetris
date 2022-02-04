import socket from "../../socket/Socket";
import { SUCESS_LOGIN, SUCESS_LOGOUT, IS_LOADING, FAIL_LOGIN } from "../types";

export const login = (user) => {
  return async (dispatch) => {
    dispatch({ type: IS_LOADING });
    try {
      const res = await socket("login", user);
      console.log(res);
      dispatch(success(res, SUCESS_LOGIN));
    }
    catch (err) {
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

const error = (data, type) => {
  return {
    type: type,
    payload: data,
  };
};
