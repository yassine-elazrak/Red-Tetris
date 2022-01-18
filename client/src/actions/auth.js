import {
    SUCESS_LOGIN,
    SUCESS_LOGOUT,
    // FAIL_LOGIN, // not used yet
    FAIL_LOGOUT,
    IS_LOADING,

    // ERROR_CREATE_ROOM,
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
    return (dispatch) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                dispatch(success(user, SUCESS_LOGOUT));
                localStorage.removeItem("user");
            }
        } catch (error) {
            dispatch(error(error, FAIL_LOGOUT));
        }
    }
}

export const isAuth = () => {
    return (dispatch) => {
        try {
            const user = localStorage.getItem("user");
            if (user) {
                // console.log(user);
                dispatch(success(JSON.parse(user), SUCESS_LOGIN));
            }
        }
        catch (e) {
            dispatch(error(e, FAIL_LOGOUT)); // for test
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
