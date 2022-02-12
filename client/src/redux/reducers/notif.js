import {
    NOTIFICATION_RECEIVE,
    NOTIFICATION_REFRESH,
    NOTIFICATION_LOADING,
    NOTIFICATION_PUSH,
    NOTIFICATION_FAILURE,
} from '../types';


const initialState = {
    isLoading: false,
    error: null,
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
        case NOTIFICATION_LOADING:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case NOTIFICATION_PUSH:
            return {
                ...state,
                isLoading: false,
                error: null,
                notifications: [
                    ...state.notifications,
                    action.payload,
                ],
            };
        case NOTIFICATION_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
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


