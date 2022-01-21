import {
    SUCESS_LOGIN,
    IS_LOADING,
    SUCESS_LOGOUT,
    FAIL_LOGIN,
    FAIL_LOGOUT,
} from '../types';

const initialState = {
    isLoading: false,
    isAuth: false,
    error: null,
    user: {
        id: null,
        name: '',
    },
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
        case FAIL_LOGIN:
            return {
                ...state,
                isLoading: false,
                isAuth: false,
                error: action.payload
            };
        case FAIL_LOGOUT:
            return {
                ...state,
                isLoading: false,
                isAuth: false,
                error: action.payload
            };
        
        default:
            return state;
    }
}
