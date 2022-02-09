import socket from "../../socket/Socket";
import {
    INVITE_REQUEST,
    INVITE_REFRESH,
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
    INVITE_FAILURE,
} from '../types';


export const inviteRequest = (invite) => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: LOADING_INVITES});
            const io = getState().socket.socket;
            const res = await socket(io, "invitation", invite);
            dispatch(success(res, INVITE_REQUEST));
        } catch (err) {
            dispatch(error(err, INVITE_FAILURE));
        }
    }
}

export const refreshInvite = () => {
    return (dispatch) => {
        dispatch({type: LOADING_INVITES});
        dispatch(success([], INVITE_REQUEST));
    }
}

export const removeAllInvetes = () => {
    return {
        type: INVITE_REMOVE_ALL,
    }
}

const success = (data, type) => {
    return {
        type: type,
        payload: data,
    }
}

const error = (data, type) => {
    return {
        type: type,
        payload: data,
    }
}