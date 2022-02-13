import socket from "../../socket/Socket";
import {
    INVITE_REQUEST,
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
    INVITE_FAILURE,
    UPDATE_PROFILE,
    INVITE_REFRESH,
    INVITE_SUCCESS,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    NOTIFICATION_FAILURE,
    ROOM_REFRESH,
} from '../types';


export const inviteRequest = (invite) => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: LOADING_INVITES});
            const io = getState().socket.socket;
            const res = await socket(io, "invitation", invite);
            dispatch(success(res, ROOM_REFRESH));
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

export const changeStatusInvite = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: LOADING_INVITES});
            const io = getState().socket.socket;
            console.log(data);
            const res = await socket(io, data.event, data);
            // console.log(res, '<<<<<<<res>');
            dispatch({type: INVITE_ACCEPT});
            dispatch(success(res.profile, UPDATE_PROFILE));
            res.room && dispatch(success(res.room, ROOM_REFRESH));
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