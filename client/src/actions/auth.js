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
    localStorage.removeItem("user");
    localStorage.removeItem("room");
    return (dispatch) => {
        dispatch({
            type: SUCESS_LOGOUT
        });
    }
}

export const isAuth = () => {
    return (dispatch) => {
        try {
            const user = localStorage.getItem("user");
            if (user) {
                console.log(user);
                dispatch(success(JSON.parse(user), SUCESS_LOGIN));
            }
        }
        catch (e) {
            console.log(e);
            dispatch(error(e, SUCESS_LOGOUT)); // for test
        }
    }
}


const success = (data, type) => {
    localStorage.setItem("user", JSON.stringify(data));
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
