import {
    IS_LOADING,
    ROOM_REFRESH,
    ROOM_CREATE,
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_ERROR,
} from './types';

export const createRoom = (room) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const data = {
        id: 1,
        name: room,
        state: 'waiting',
        adminId: user.id,
        users: [user.id],
    };
    // console.log(user.id + " " + room);
    return async (dispatch) => {
        dispatch({type: IS_LOADING});
        dispatch(success(data, ROOM_CREATE));
    }
}

export const refreshRoom = () => {
    return (dispatch) => {
        try {
            const room = localStorage.getItem("room");
            // console.log(room + " << room");
            if (room) {
                dispatch(success(JSON.parse(room), ROOM_REFRESH));
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}


const success = (data, type) => {
    console.log(data + " <<<< done")
    localStorage.setItem("room", JSON.stringify(data));
    return {
        type: type,
        payload: data
    }
}

const error = (data, type) => {
    return {
        type: type,
        payload: data
    }
}
