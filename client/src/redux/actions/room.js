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
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const res = await socket(io, "createRoom", room);
      dispatch(success(res, ROOM_CREATE));
    } catch (err) {
      dispatch(error(err, ROOM_ERROR));
    }
  };
};

export const joinRoom = (roomId) => {
  // console.log("joinRoom", roomId);
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const res = await socket(io, "joinRoom", roomId);
      dispatch(success(res, ROOM_JOIN));
    } catch (err) {
      dispatch(error(err, ROOM_ERROR));
    }
  };
};

export const leaveRoom = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const roomId = getState().room.id;
      await socket(io, "leaveRoom", roomId);
      dispatch(success(null, ROOM_LEAVE));
    } catch (err) {
      dispatch(error(err, ROOM_ERROR));
    }
  };
};

export const closeRoom = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const roomId = getState().room.id;
      const res = await socket(io, "closeRoom", roomId);
      dispatch(success(res, ROOM_UPDATE_STATUS));
    } catch (err) {
      dispatch(error(err, ROOM_ERROR));
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
