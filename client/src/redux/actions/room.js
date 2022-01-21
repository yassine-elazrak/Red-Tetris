import {
    ROOM_REFRESH,
    ROOM_CREATE,
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_ERROR,
    ROOM_CLOSE,
} from '../types';


export const createRoom = (room) => {
    return async (dispatch) => {
        dispatch(success(room, ROOM_CREATE));
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
    return async (dispatch) => {
        dispatch(success(room, ROOM_JOIN));
    }
}

export const leaveRoom = (userId) => {
    // if room users length is 1, delete room
    return (dispatch) => {
        dispatch(success({userId}, ROOM_LEAVE));
    }
}

export const closeRoom = (room) => {
    return (dispatch) => {
        const data = {
            ...room,
            status: 'closed',
        };
        if (room.status === 'waiting' && room.isAdmin)
            dispatch(success(data, ROOM_CLOSE));
        else
            dispatch(error("You are not admin", ROOM_ERROR));
    }
}



const success = (data, type) => {
    // console.log(data , " <<<< done")
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
