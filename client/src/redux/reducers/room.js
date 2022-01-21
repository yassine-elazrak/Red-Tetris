import {
    ROOM_CREATE,
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_REFRESH,
    ROOM_ERROR,
    ROOM_CLOSE,
} from "../types";

const initialState = {
    isLoading: false,
    error: null,
    is_joined: false,
    isPravite: false,
    isAdmin : false,
    status: '',
    id: null,
    name: null,
    users: [],
};

const createRoom = (state, action) => {
    // console.log(action.payload);
    const user = {
        id: action.payload.user.id,
        name: action.payload.user.name,
    };
    const data = {
        ...state,
        isLoading: false,
        error: null,
        is_joined: true,
        isAdmin: true,
        status: action.payload.isPravite ? 'closed' : 'waiting',
        isPravite: action.payload.isPravite,
        id: action.payload.roomId,
        name: action.payload.roomName,
        users: [user],
    };
    localStorage.setItem("room", JSON.stringify(data));
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
            is_joined: true,
            isAdmin: false,
            isPravite: action.payload.isPravite,
            id: action.payload.roomId,
            name: action.payload.roomName,
            status: action.payload.status,
            users: [...state.users, user],
        };
        localStorage.setItem("room", JSON.stringify(data));
        return data;
    } else {
        return {
            ...state,
            isLoading: false,
            error: `${action.payload.userName} is already in the room`,
        };
    }
};

const deleteUser = (state, action) => {
    // modef it to delete user from room
    // console.log(action.payload);
    const index = state.users.findIndex(user => user.id === action.payload.userId);
    if (index !== -1) {
        const users = [...state.users];
        users.splice(index, 1);
        const data = {
            ...state,
            isLoading: false,
            users: users,
        };
        localStorage.setItem("room", JSON.stringify(data));
        return data;
    } else {
        return {
            ...state,
            isLoading: false,
            error: `${action.payload.userName} is not in the room`,
        };
    }
};

const deletRoom = (state, action) => {
    localStorage.removeItem("room");
    return initialState;
};

const refreshRoom = (state, action) => {
    const data = localStorage.getItem("room");
    // console.log(data);
    if (data) {
        const room = JSON.parse(data);
        return {
            ...room,
            isLoading: false,
            error: null,
        };
    } else {
        return initialState;
    }
};


export default function roomReducer(state = initialState, action) {
    switch (action.type) {
        case ROOM_CREATE:
            return createRoom(state, action);
        case ROOM_JOIN:
            return pushUser(state, action);
        case ROOM_LEAVE:
            return deletRoom(state, action);
        case ROOM_REFRESH:
            return refreshRoom(state, action);
        case ROOM_CLOSE:
            return {
                ...state,
                isLoading: false,
                error: null,
                status: 'closed',
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
