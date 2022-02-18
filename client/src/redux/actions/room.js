import socket from "../../socket/Socket";
import _ from 'lodash';
import {
  ROOM_CREATE,
  ROOM_JOIN,
  ROOM_LEAVE,
  ROOM_ERROR,
  ROOM_UPDATE_STATUS,
  LOADING_ROOM,
  ROOM_REFRESH,
  GAME_UPDATE,
} from "../types";

const game = (data, userId) => {
  let user = data.find(e => e.id === userId);
  console.log(user, 'user');
  let newData = _.pick(user, ['map', 'nextTetromino', 'nextTetrominos', 'scor', 'rows', 'status']);
  return newData;
}

export const createRoom = (room) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const res = await socket(io, "createRoom", room);
      dispatch(success(res, ROOM_CREATE));
      // const profile = getState().profile;
      // const gameInfo = game(res.users, profile.id);
      // dispatch(success(gameInfo, GAME_UPDATE));
    } catch (err) {
      dispatch(error(err, ROOM_ERROR));
    }
  };
};

export const createOrJoinRoom = (room) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const res = await socket(io, "createOrJoin", room);
      dispatch(success(res, ROOM_CREATE));
      const profile = getState().profile;
      // const gameInfo = game(res.users, profile.id);
      // console.log(gameInfo);
      // dispatch(success(gameInfo, GAME_UPDATE));
    } catch (err) {
      console.log(err);
      dispatch(error(err, ROOM_ERROR));
    }
  }
}

export const joinRoom = (roomId) => {
  // //console.log("joinRoom", roomId);
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const res = await socket(io, "joinRoom", roomId);
      //console.log('res join room =>', res);
      dispatch(success(res, ROOM_JOIN));
      // const profile = getState().profile;
      // const gameInfo = game(res.users, profile.id);
      // dispatch(success(gameInfo, GAME_UPDATE));
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

export const clearRoom = () => {
  return (dispatch) => {
    dispatch(success(null, ROOM_LEAVE));
  }
}

export const changeStatusRoom = (data) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: LOADING_ROOM });
      const io = getState().socket.socket;
      const res = await socket(io, "changeStatusRoom", data);
      dispatch(success(res, ROOM_UPDATE_STATUS));
    } catch (err) {
      dispatch(error(err, ROOM_ERROR));
    }
  };
};

export const refreshRoom = (room) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_ROOM });
    // const profile = getState().profile;
    // const gameInfo = game(room.users, profile.id);
    // dispatch(success(gameInfo, GAME_UPDATE));
    dispatch(success(room, ROOM_REFRESH))
  }
}

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
