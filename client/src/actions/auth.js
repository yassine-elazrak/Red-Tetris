import {
    SUCESS_LOGIN,
    SUCESS_LOGOUT,
    IS_LOADING,
    SUCESS_CREATE_ROOM,

    ERROR_CREATE_ROOM,
} from "./types";

export const login = (user) => {
    // console.log("login action" + user);
    const data = {id: 1, name: user};
    return (dispatch) => {
        dispatch({type: IS_LOADING});
        dispatch(success(data, SUCESS_LOGIN));
    }
}

export const logout = () => {
    console.log("logout action");
    return (dispatch) => {
        dispatch({
            type: SUCESS_LOGOUT
        });
    }
}

export const isAuth = () => {
    return (dispatch) => {
        try {
            const user = localStorage.getItem("data");
            if (user) {
                dispatch(success(JSON.parse(user), SUCESS_LOGIN));
                dispatch(login);
            }
        }
        catch (e) {
            console.log(e);
            dispatch(error(e, SUCESS_LOGOUT)); // for test
        }
    }
}

export const createRoom = (room) => {
    const user = JSON.parse(localStorage.getItem("data"));
    const data = {
        id: 1,
        name: room,
        state: 'waiting',
        adminId: user.id,
        users: [user.id],
    };
    console.log(user.id + " " + room);
    return async (dispatch) => {
        dispatch({type: IS_LOADING});
        await setTimeout(() => {
        // dispatch({
        //     type: SUCESS_CREATE_ROOM,
        //     payload: data
        // });
        dispatch(error("test", ERROR_CREATE_ROOM));
        }, 1000);
    }
}


const success = (data, type) => {
    localStorage.setItem('data', JSON.stringify(data));
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
