import socket from "../../socket/Socket";
import {
  ROOM_CREATE,
  ROOM_JOIN,
  ROOM_LEAVE,
  ROOM_ERROR,
  ROOM_CLOSE,
  LOADING_ROOM,
} from "../types";

export const createRoom = (room) => {
  // console.log(room);
  return async (dispatch) => {
    dispatch({ type: LOADING_ROOM });
    try {
      const res = await socket("room", "create", room);
      // console.log(res, "res");
      dispatch(success(res, ROOM_CREATE));
    } catch (err) {
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
  return (dispatch) => {
    const data = {
      ...room,
      status: "closed",
    };
    if (room.status === "waiting") {
      room.isAdmin
        ? dispatch(success(data, ROOM_CLOSE))
        : dispatch(error("You are not admin", ROOM_ERROR));
    } else dispatch(error("room error"), ROOM_ERROR);
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
