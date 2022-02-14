import {
    INVITE_REQUEST,
    INVITE_FAILURE,
    INVITE_ACCEPT,
    INVITE_DECLINE,
    INVITE_REMOVE_ALL,
    LOADING_INVITES,
    INVITE_REFRESH,
    INVITE_SUCCESS
} from '../types';

const initialState = {
    isLoading: false,
    error: null,
    // room_id: null,
    // invites: [],
}

const removeAll = (state) => {
    const data = {
        ...state,
        invites: [],
    }
    return data;
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
        // case INVITE_REQUEST:
        //     return {
        //         ...state,
        //         isLoading: false,
        //         error: null,
        //         invites: action.payload,
        //     };
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
        // case INVITE_REMOVE_ALL:
        //     return removeAll(state);
        default:
            return state;
    }
}