import {
    SUCESS_LOGIN,
    SUCESS_LOGOUT,
    FAIL_LOGOUT,
    IS_LOADING,
} from "../types";

export const login = (user) => {
    const data = {id: 1, name: user};
    return (dispatch) => {
        dispatch({type: IS_LOADING});
        dispatch(success(data, SUCESS_LOGIN));
    }
}

export const logout = () => {
    return (dispatch) => dispatch(success({}, SUCESS_LOGOUT));

}


const success = (data, type) => {
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
