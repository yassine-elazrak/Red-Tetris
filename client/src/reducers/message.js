import {
    MESSAGE_RECEIVED,
    MESSAGE_SENT,
    MESSAGE_SEND_FAILED,
} from '../actions/types';

const initialState = {
    isLoading: false,
    error: null,
    messages: [
        {
            id: null,
            user: null,
            text: '',
            createdAt: null,
        }
    ],
};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case MESSAGE_RECEIVED:
            return {
                ...state,
                message: [...state.messages, action.paload.message]
            }
        case MESSAGE_SENT:
            return {
                ...state,
                message: [...state.messages, action.paload.message]
            }
        case MESSAGE_SEND_FAILED:
            return {
                ...state,
                error: action.payload
            }

        default:
            return state;
    }
}


export default messageReducer;
