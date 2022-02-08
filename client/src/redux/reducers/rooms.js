import {
    ROOMS_ERROR,
    ROOMS_LOADING,
    ROOMS_REFRESH,
} from "../types";

const initialState = {
    isLoading: false,
    error: null,
    rooms: [],
};

export default function roomsReducer(state = initialState, action) {
    switch (action.type) {
        case ROOMS_LOADING:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ROOMS_REFRESH:
            return {
                ...state,
                isLoading: false,
                error: null,
                rooms: action.payload,
            };
        case ROOMS_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

