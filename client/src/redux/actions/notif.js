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
//             ////console.log(err);
//             dispatch(error(err, FAIL_LOGIN));
//         }
//     };
// };






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