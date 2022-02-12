import socket from "../../socket/Socket";
import {
    INVITE_REQUEST,
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
    INVITE_FAILURE,
    UPDATE_USER,
    INVITE_REFRESH,
    INVITE_SUCCESS,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    NOTIFICATION_FAILURE,
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

export const refreshInvite = (data) => {
    return (dispatch) => {
        dispatch({type: LOADING_INVITES});
        dispatch(success(data, INVITE_REQUEST));
    }
}

export const acceptInvite = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: LOADING_INVITES});
            const io = getState().socket.socket;
            const res = await socket(io, "acceptInvitation", data);
            // console.log(res, '<<<<<<<res>');
            dispatch({type: INVITE_ACCEPT});
            dispatch(success(res, UPDATE_USER));
        } catch (err) {
            dispatch(error(err, NOTIFICATION_FAILURE));
        }
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