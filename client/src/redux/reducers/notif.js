import {
    NOTIFICATION_RECEIVE,
    NOTIFICATION_REFRESH
} from '../types';


const initialState = {
    isLoading: false,
    error: null,
    read: false,
    status: null,
    notifications: [
        // userId: userId,
        // userName: userName,
        // roomId: roomId,
        // roomName: roomName,
        // read: false | true,
        // type: invite | message | ...,
        // content: content,
        // createdAt: createdAt,
        // updatedAt: updatedAt,
    ],
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


