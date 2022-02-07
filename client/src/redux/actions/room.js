import socket from "../../socket/Socket";
import {
  ROOM_CREATE,
  ROOM_JOIN,
  ROOM_LEAVE,
  ROOM_ERROR,
  ROOM_UPDATE_STATUS,
  LOADING_ROOM,
} from "../types";

export const createRoom = (room) => {
  // console.log(room);
  return async (dispatch, getState) => {
    dispatch({ type: LOADING_ROOM });
    try {
      const io = getState().socket.socket;
      const res = await socket(io, "roomCreate", room);
      console.log(res, "resRoom");
      dispatch(success(res, ROOM_CREATE));
    } catch (err) {
      console.log(err, 'roomCreateerror');
      dispatch(error(err, ROOM_ERROR));
    }
  };
};

export const joinRoom = (room) => {
  return async (dispatch) => {
    dispatch(success(room, ROOM_JOIN));
  };
};

export const leaveRoom = (userId) => {
  return (dispatch) => {
    dispatch(success({ userId }, ROOM_LEAVE));
  };
};

export const closeRoom = (room) => {
  return async (dispatch, getState) => {
    console.log(room, "roomclose");
    try {
      const io = getState().socket.socket;
      const res = await socket(io, "closeRoom", room);
      dispatch(success(res, ROOM_UPDATE_STATUS));
    } catch (error) {
      console.log(error, "roomcloseerror");
      dispatch(error(error, ROOM_ERROR));
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
