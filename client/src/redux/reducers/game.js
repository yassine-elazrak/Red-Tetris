
import {
    GAME_UPDATE,
    GAME_LOADING,
    GAME_ERROR,
    GAME_CLEAR,
} from "../types";


const initialState = {
    isLoading: false,
    error: null,
    map: [],
    nextTetrominos: [0],
    currentTetromino: 0,
    scor: 0,
    rows: 0,
    status: null,
}

export default function gameReducer(state = initialState, action) {
    switch (action.type) {
        case GAME_LOADING:
            return {
                ...state,
                error: null,
                isLoading: true,
            }
        case GAME_UPDATE:
            return {
                ...state,
                error: null,
                isLoading: false,
                ...action.payload,
            }
        case GAME_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case GAME_CLEAR:
            return {
                ...initialState,
            }
        default:
            return state;
    }
}