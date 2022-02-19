import socket from "../../socket/Socket";
import {
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
    INVITE_FAILURE,
    UPDATE_PROFILE,
    INVITE_SUCCESS,
    INVITE_ACCEPT,
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
            dispatch({type: INVITE_SUCCESS});
        } catch (err) {
            dispatch(error(err, INVITE_FAILURE));
        }
    }
}

export const changeStatusInvite = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: LOADING_INVITES});
            const io = getState().socket.socket;
            ////console.log(data);
            const res = await socket(io, data.event, data);
            ////console.log("res chnage status initation", res);
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