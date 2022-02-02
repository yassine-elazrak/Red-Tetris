import {io} from "socket.io-client";
import { SUCESS_LOGIN, SUCESS_LOGOUT, IS_LOADING, FAIL_LOGIN } from "../types";

export const login = (user) => {
  const data = { id: 1, name: user };
  return async (dispatch) => {
    dispatch({ type: IS_LOADING });
    // dispatch(success(data, SUCESS_LOGIN));
    // try {
    //     const response = await socketio('http://localhost:8000/');

    //     response.on('connect', () => {
    //         console.log('connected');
    //          response.emit('login', user);
    //     });

    //     // const socket = await socketio('http://localhost:5000');
    //     // const test = await socket.emit('login', user);
    //     // // const response = await test;
    //     // console.log(test);
    //     // await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    //     dispatch(success(data, SUCESS_LOGIN));
    // } catch (err) {
    //     dispatch(error(err, FAIL_LOGIN));
    // }
    // const io = socketio('http://localhost:5000/');
    // await io.emit('login', user);
    // await io.on('login', (data) => {
    //     console.log(data, 'data');
    // });

    try {
        const socket = await io('http://localhost:4000');
    } catch (e) {
        console.log(e);
        dispatch(error(e, FAIL_LOGIN));
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
