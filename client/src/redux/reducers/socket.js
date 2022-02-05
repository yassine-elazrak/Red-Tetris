import {
    SOCKET_CONNECT,
    SOCKET_ERROR,
    LOADING_SOCKET,
} from "../types";


const initialState = {
    isConnected: false,
    isLoading: false,
    socket: null,
    error: null,
};



export default function socket(state = initialState, action) {
    switch (action.type) {
        case LOADING_SOCKET:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SOCKET_CONNECT:
            return {
                ...state,
                isConnected: true,
                isLoading: false,
                socket: action.payload,
                error: null,
            };
        case SOCKET_ERROR:
            return {
                ...state,
                isConnected: false,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}
