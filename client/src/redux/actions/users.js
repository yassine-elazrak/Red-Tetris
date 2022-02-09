import socket from "../../socket/Socket";
import {
    CURRENT_ONLINE_USERS,
    LOADING_ONLINE_USERS,
    ONLINE_USERS_ERROR,
} from '../types';


export const onlineUsers = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: LOADING_ONLINE_USERS });
            const io = getState().socket.socket;
            const res = await socket(io, "onlineUsers", null);
            dispatch(success(res, CURRENT_ONLINE_USERS));
        } catch (err) {
            dispatch(error(err, ONLINE_USERS_ERROR));
        }
    }
}


export const onlineUsersUpdate = (data) => {
    return (dispatch) => {
        dispatch(success(data, CURRENT_ONLINE_USERS));
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