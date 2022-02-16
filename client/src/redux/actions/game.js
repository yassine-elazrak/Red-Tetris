import socket from "../../socket/Socket";

import {
    GAME_UPDATE,
    GAME_LOADING,
    GAME_ERROR,
} from "../types";

export const gameActions = (data) => {
    return async(dispatch, getState) => {
        try {
            dispatch({type: GAME_LOADING});
            const io = getState().socket.socket;
            const res = await socket(io, 'gameActions', data);
            dispatch(success(res, GAME_UPDATE))
        } catch (err) {
            dispatch(error(err));
        }
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