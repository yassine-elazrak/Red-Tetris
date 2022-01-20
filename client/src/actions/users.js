import {
    CURRENT_USER,
} from './types';


export const currentUser = (value) => {
    return (dispatch) => {
        dispatch(success({value: value}, CURRENT_USER));
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