import {
    INVITE_FAILURE,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    LOADING_INVITES,
    INVITE_SUCCESS
} from '../types';

const initialState = {
    isLoading: false,
    error: null,
}

export default function inviteReducer(state = initialState, action) {
    switch (action.type) {
        case LOADING_INVITES:
            return {
                ...state,
                error: null,
                isLoading: true,
            }
        case INVITE_SUCCESS:
            return {
                ...state,
                error: null,
                isLoading: false,
            };
        case INVITE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case INVITE_ACCEPT:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        case INVITE_DECLINE:
            return {
                ...state,
                isLoading: false,
                error: null,
            };
        default:
            return state;
    }
}