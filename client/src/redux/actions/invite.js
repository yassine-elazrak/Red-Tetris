import {
    INVITE_REQUEST,
    INVITE_SUCCESS,
    INVITE_FAILURE,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    INVITE_REFRESH,
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
} from '../types';


export const inviteRequest = (invite) => {
    // const data = {
    //     ...user,
    //     state: 'waiting',
    // }
    return (dispatch) => {
        dispatch({type: LOADING_INVITES});
        dispatch(success(invite, INVITE_REQUEST));
    }
}

export const refreshInvite = () => {
    return (dispatch) => {
        dispatch({type: LOADING_INVITES});
        dispatch(success(null, INVITE_REFRESH));
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