import socket from "../../socket/Socket";
import {
    LOADING_MESSAGE,
    MESSAGE_RECEIVED,
    MESSAGE_SENT_SUCCESS,
    MESSAGE_SEND_FAILED,
    CLEAR_MESSAGES,
} from '../types'

export const sentMessage = (data) => {
    return async (dispatch, getState) => {
        dispatch({type : LOADING_MESSAGE});
        try {
            const io = getState().socket.socket;
            const res = await socket(io, "sentMessage", data);
            dispatch(success(MESSAGE_SENT_SUCCESS, res));
        } catch (err) {
            dispatch(error(err));
        }
    }
}


export const receiveMessage = (data) => {
    return (dispatch) => {
        dispatch(success(MESSAGE_RECEIVED, data));
    }
}


export const clearMessages = () => {
    return (dispatch) => {
        dispatch({type: CLEAR_MESSAGES});
    }
}

const success = (type, data) => {
    return {
        type,
        payload : data,
    }
}

const error = (err) => {
    return {
        type: MESSAGE_SEND_FAILED,
        payload: err,
    }
}

