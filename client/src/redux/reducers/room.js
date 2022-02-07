import {
    ROOM_CREATE,
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_ERROR,
    ROOM_UPDATE_STATUS,
    LOADING_ROOM,
} from "../types";

const initialState = {
    isLoading: false,
    error: null,
    // isJoned: false,
    isPravite: false,
    // isAdmin : false,
    admin: null,
    status: '',
    // id: null,
    name: null,
    users: [
        // userId: userId,
        // userName: userName,
        // joinedAt: joinedAt,
    ],
};

const createRoom = (state, action) => {
    const data = {
        ...state,
        isLoading: false,
        error: null,
        admin: action.payload.admin,
        status: action.payload.status,
        isPravite: action.payload.isPravite,
        name: action.payload.name,
        users: [action.payload.users],
    };
    return data;
};

const pushUser = (state, action) => {
    const index = state.users.findIndex(user => user.id === action.payload.userId);
    if (index === -1) {
        const user = {
            id: action.payload.userId,
            name: action.payload.userName,
        };
        const data = {
            ...state,
            isLoading: false,
            error: null,
            // isJoned: true,
            // isAdmin: false,
            isPravite: action.payload.isPravite,
            id: action.payload.roomId,
            name: action.payload.roomName,
            status: action.payload.status,
            users: [...state.users, user],
        };
        return data;
    } else {
        return {
            ...state,
            isLoading: false,
            error: `${action.payload.userName} is already in the room`,
        };
    }
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
            return createRoom(state, action);
        case ROOM_JOIN:
            return pushUser(state, action);
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
