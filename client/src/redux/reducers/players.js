import {
    CLEAR_PLAYERS,
    UPDATE_ALL_PLAYERS,
    UPDATE_ONE_PLAYER,
} from '../types'

const INITIAL_STATE = {
    players: [],
};

const updateOnePlayer = (player, players) => {
    let P_index = players.findIndex(p => p.id === player.id)
    if (P_index === -1 ) players.push(player);
    else{
        players[P_index] = player;
    }
    return players;
}
 
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_ONE_PLAYER:
            return{
                players: updateOnePlayer(action.payload, state.players)
            }
        case UPDATE_ALL_PLAYERS:
            return {
                players: action.payload,
            }
        case CLEAR_PLAYERS:
            return INITIAL_STATE;
        default:
            return state
    }
}