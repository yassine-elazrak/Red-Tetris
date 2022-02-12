import {
    ROOM_CREATE,
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_ERROR,
    ROOM_UPDATE_STATUS,
    LOADING_ROOM,
    ROOM_REFRESH,
} from "../types";

const initialState = {
    isLoading: false,
    error: null,
    isPravite: false,
    admin: null,
    status: '',
    id: null,
    name: null,
    users: [],
};



export default function roomReducer(state = initialState, action) {
    switch (action.type) {
        case LOADING_ROOM:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ROOM_CREATE:
            return {
                ...state,
                isLoading: false,
                error: null,
                ...action.payload,
                // id: action.payload.id,
                // name: action.payload.name,
                // admin: action.payload.admin,
                // status: action.payload.status,
                // isPravite: action.payload.isPravite,
                // users: action.payload.users,
            }
        case ROOM_REFRESH:
            return {
                ...state,
                isLoading: false,
                error: null,
                ...action.payload,
                // id: action.payload.id,
                // name: action.payload.name,
                // admin: action.payload.admin,
                // status: action.payload.status,
                // isPravite: action.payload.isPravite,
                // users: action.payload.users,
            }
        case ROOM_JOIN:
            return {
                ...state,
                isLoading: false,
                error: null,
                ...action.payload,
                // id: action.payload.id,
                // name: action.payload.name,
                // isPravite: action.payload.isPravite,
                // admin: action.payload.admin,
                // status: action.payload.status,
                // users: action.payload.users,
            };
        case ROOM_LEAVE:
            return initialState;
        case ROOM_UPDATE_STATUS:
            return {
                ...state,
                isLoading: false,
                error: null,
                status: action.payload.status,
            };
        case ROOM_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        default:
            return state;
    }
}
