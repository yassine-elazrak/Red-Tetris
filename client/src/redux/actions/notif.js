import socket from "../../socket/Socket";

import {
    NOTIFICATION_LOADING,
    NOTIFICATION_RECEIVE,
    NOTIFICATION_REFRESH,
    NOTIFICATION_PUSH,
} from "../types";


// export const getNotifications = (userId) => {
//     return async (dispatch, getState) => {
//         dispatch({ type: NOTIFICATION_LOADING });
//         try {

//         }
//         catch (err) {
//             console.log(err);
//             dispatch(error(err, FAIL_LOGIN));
//         }
//     };
// };

export const refreshNotifications = (notifications) => {
    return (dispatch) => {
        dispatch({type: NOTIFICATION_LOADING});
        dispatch({ type: NOTIFICATION_REFRESH, payload: notifications });
    };
};

export const pushNotification = (notification) => {
    return (dispatch) => {
        dispatch({ type: NOTIFICATION_LOADING });
        dispatch({ type: NOTIFICATION_PUSH, payload: notification });
    };
};




const success = (data, type) => {
    return {
        type: type,
        payload: data,
    };
}

const error = (message, type) => {
    return {
        type: type,
        payload: message,
    };
}