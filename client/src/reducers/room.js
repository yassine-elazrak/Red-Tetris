import {
    ROOM_CREATE,
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_REFRESH,
    ROOM_ERROR,
    ROOM_CLOSE,
    ROOM_CLEAR_ERROR,
} from "../actions/types";

const initialState = {
    isLoading: false,
    error: null,
    is_joined: false,
    isPravite: false,
    room: {
        id: null,
        name: '',
        admin: null,
        users: [],
    }
};

export default function roomReducer(state = initialState, action) {
    switch (action.type) {
        case ROOM_CREATE:
            return {
                ...state,
                isLoading: false,
                is_joined: true,
                isPravite: action.payload.isPrivate,
                room: {
                    id: action.payload.id,
                    name: action.payload.name,
                    admin: action.payload.admin,
                    users: action.payload.users,
                }
            };
        case ROOM_JOIN:
            return {
                ...state,
                isLoading: false,
                is_joined: true,
                isPravite: action.payload.isPrivate,
                room: {
                    id: action.payload.id,
                    name: action.payload.name,
                    admin: action.payload.admin,
                    users: [...state.room.users , action.payload.users]
                }
            };
        case ROOM_LEAVE:
            return {
                ...state,
                isLoading: false,
                is_joined: false,
                isPravite: false,
                room: {
                    id: null,
                    name: '',
                    admin: null,
                    users: [],
                }
            };
        case ROOM_REFRESH:
            return {
                ...state,
                isLoading: false,
                is_joined: true,
                isPravite: action.payload.isPrivate,
                room: {
                    id: action.payload.id,
                    name: action.payload.name,
                    admin: action.payload.admin,
                    users: action.payload.users,
                }
            };
        case ROOM_CLOSE:
            return {
                ...state,
                isLoading: false,
                state: action.payload.state,
            };
        case ROOM_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        case ROOM_CLEAR_ERROR:
            return {
                ...state,
                isLoading: false,
                error: null
            };
        
        default:
            return state;
    }
}
