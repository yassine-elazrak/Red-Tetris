import {
    IS_LOADING,
    ROOM_REFRESH,
    ROOM_CREATE,
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_ERROR,
    ROOM_CLOSE,
} from './types';

// import 

export const createRoom = (room) => {
    const data = {
        id: 1,
        name: room.name,
        isPrivate: room.isPrivate,
        state: 'waiting',
        adminId: room.user.id,
        users: [room.user.id],
    };
    return async (dispatch) => {
        dispatch({type: IS_LOADING});
        dispatch(success(data, ROOM_CREATE));
    }
}

export const refreshRoom = () => {
    return (dispatch) => {
        try {
            const room = localStorage.getItem("room");
            if (room) {
                dispatch(success(JSON.parse(room), ROOM_REFRESH));
            }
        }
        catch (e) {
            dispatch(error(e, ROOM_ERROR));
        }
    }
}

export const joinRoom = (room) => {
    const data = {
        id: 1,
        name: room.name,
        state: 'waiting',
        users: [room.user.id],
    };
    return async (dispatch) => {
        dispatch({type: IS_LOADING});
        dispatch(success(data, ROOM_JOIN));
    }
}

export const leaveRoom = () => {
    // if room users length is 1, delete room
    return (dispatch) => {
        try {
            const room = localStorage.getItem("room");
            if (room) {
                dispatch(success(JSON.parse(room), ROOM_LEAVE));
                localStorage.removeItem("room");
            }
        }
        catch (e) {
            dispatch(error(e, ROOM_ERROR));
        }
    }
}

export const closeRoom = (room) => {
    return (dispatch) => {
        const data = {
            state: 'closed',
        };
        if (room.state === 'waiting' && room.adminId === room.user.id)
            dispatch(success(data, ROOM_CLOSE));
        else
            dispatch(error("You are not admin", ROOM_ERROR));
    }
}


const success = (data, type) => {
    // console.log(data + " <<<< done")
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
