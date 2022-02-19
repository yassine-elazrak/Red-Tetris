import {
    CLEAR_PLAYERS,
    UPDATE_ALL_PLAYERS,
    UPDATE_ONE_PLAYER,
} from '../types'

export const updateOnePlayer = (data) => {
    return (dispatch) => {
        dispatch(success(UPDATE_ONE_PLAYER, data));
    }
}

export const updateAllPlayers = (data) => {
    return (dispatch, getState) => {
        let profile = getState().profile
        let filterPlayers = filter_players(data, profile.id);
        dispatch(success(UPDATE_ALL_PLAYERS, filterPlayers));
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

const filter_players = (players, id) => {
    console.log(players, id, 'players, id');
    let newPlayers = players.filter(p => p.id !== id);
    return newPlayers;
}