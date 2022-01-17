import { SUCESS_LOGIN, SUCESS_LOGOUT, IS_LOADING } from "./types";

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
            // console.log(e);
        }
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
