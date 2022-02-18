import socket from "../../socket/Socket";

import {
    GAME_UPDATE,
    GAME_LOADING,
    GAME_ERROR,
    GAME_CLEAR,
    ROOM_REFRESH,
} from "../types";

export const gameActions = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: GAME_LOADING });
            const io = getState().socket.socket;
            const res = await socket(io, 'gameActions', data);
            console.log('res =========>>>>', res);
            dispatch(success(res, GAME_UPDATE))
        } catch (err) {
            dispatch(error(err));
        }
    }
}

export const continueGame = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: GAME_LOADING });
            const io = getState().socket.socket;
            const res = await socket(io, 'continueGame', data)
            dispatch(success(res.game, GAME_UPDATE));
            dispatch(success(res.room, ROOM_REFRESH));
        } catch (err) {
            dispatch(error(err));
        }
    }
}

export const updateGame = (data) => {
    return (dispatch) => {
        dispatch(success(data, GAME_UPDATE));
    }
}

export const gameClear = () => {
    return (dispatch) => {
        dispatch({type: GAME_CLEAR});
    }
}

const success = (data, type) => {
    return {
        type: type,
        payload: data,
    }
}

const error = (err) => {
    return {
        type: GAME_ERROR,
        payload: err,
    }
}