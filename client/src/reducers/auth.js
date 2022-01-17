import { SUCESS_LOGIN, IS_LOADING, SUCESS_LOGOUT, SUCESS_CREATE_ROOM } from '../actions/types';

const initialState = {
    isLoading: false,
    isAuth: false,
    user: {
        id: null,
        name: '',
    },
    room: {
        id: null,
        name: '',
        state: null,
        users: [],
        messages: []
    }
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case IS_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case SUCESS_LOGIN:
            return {
                ...state,
                isLoading: false,
                isAuth: true,
                user: {
                    id: action.payload.id,
                    name: action.payload.name,
                }
            };
        case SUCESS_LOGOUT:
            delete localStorage.data;
            return {
                ...state,
                isLoading: false,
                isAuth: false,
                user: {
                    id: '',
                    name: '',
                }
            };
        case SUCESS_CREATE_ROOM:
            return {
                ...state,
                isLoading: false,
                room: {
                    id: action.payload.id,
                    name: action.payload.name,
                    state: action.payload.state,
                    users: action.payload.users,
                    messages: action.payload.messages
                }
            };
        default:
            return state;
    }
}
