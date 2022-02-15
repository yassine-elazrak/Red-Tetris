import {
    LOADING_MESSAGE,
    MESSAGE_SENT_SUCCESS,
    MESSAGE_SEND_FAILED,
    MESSAGE_RECEIVED,
    CLEAR_MESSAGES,
} from '../types';

const initialState = {
    isLoading: false,
    error: null,
    messages: [],
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADING_MESSAGE:
            return {
                ...state,
                error: null,
                isLoading: true,
            }
        case MESSAGE_RECEIVED:
            return {
                ...state,
                isLoading: false,
                error: null,
                messages: [...state.messages, action.payload],
            }
        case MESSAGE_SENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                messages: [...state.messages, action.payload],
            }
        case MESSAGE_SEND_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        case CLEAR_MESSAGES:
            return {
                ...initialState,
            }
        default:
            return state;
    }
}


export default messageReducer;
