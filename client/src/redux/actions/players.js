import {
    UPDATE_PLAYERS,
    CLEAR_PLAYERS,
} from '../types'


export const updatePlayers = (data) => {
    return (dispatch) => {
        dispatch(success(UPDATE_PLAYERS, data));
    }
}

export const clearPlayers = () => {
    return (dispatch) => {
        dispatch({type: CLEAR_PLAYERS});
    }
}

const success = (type, action) => {
    return {
        type,
        payload: action,
    }
}