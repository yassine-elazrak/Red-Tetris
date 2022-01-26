import {
    CURRENT_ONLINE_USERS,
    LOADING_ONLINE_USERS,
} from '../types';


export const currentUser = (value) => {
    return (dispatch) => {
        dispatch({type: LOADING_ONLINE_USERS});
        dispatch(success({value: value}, CURRENT_ONLINE_USERS));
    }
}





const success = (data, type) => {
    return {
        type: type,
        payload: data,
    }
}

// const error = (data, type) => {
//     return {
//         type: type,
//         payload: data,
//     }
// }