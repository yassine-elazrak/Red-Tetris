import socket from "../../socket/Socket";
import { SUCESS_LOGIN, SUCESS_LOGOUT, IS_LOADING, FAIL_LOGIN } from "../types";

export const login = (user) => {
  // const data = { id: 1, name: user };
  return async (dispatch) => {
    dispatch({ type: IS_LOADING });
    try {
      const io = socket((error, data) => {
        if (error) {
          dispatch({ type: FAIL_LOGIN, payload: error });
        } else {
          dispatch({ type: SUCESS_LOGIN, payload: data });
        }
      });
      // io.emit("login", user, (data) => {
      //   dispatch({ type: SUCESS_LOGIN, payload: data });
      // });
    } catch (err) {
      dispatch(error(err, FAIL_LOGIN));
    }
  };
};

// export const logout = () => {
//     return (dispatch) => dispatch(success({}, SUCESS_LOGOUT));

// }

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
