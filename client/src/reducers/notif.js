import {
    NOTIFICATION_RECEIVE,
    NOTIFICATION_REFRESH
} from '../actions/types';


const initialState = {
    isLoading: false,
    error: null,
    read: false,
    status: null,
    notifications: [{
        id: null,
        type: null,
        user: {
            id: null,
            name: '',
        },
        room: {
            id: null,
            name: '',
            state: null,
        }
    }],
};

const notifReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATION_RECEIVE:
            return {
                ...state,
                isLoading: false,
                notifications: [...state.notifications, action.payload]
            };
        case NOTIFICATION_REFRESH:
            return {
                ...state,
                isLoading: false,
                notifications: action.payload
            };
        default:
            return state;
    }
}


export default notifReducer;


