
import {
  SUCESS_LOGIN,
  LOADING_USER,
  FAIL_LOGIN,
  UPDATE_PROFILE,
  NOTIFICATION_PUSH,
  NOTIFICATION_REFRESH,

} from "../types";

const initialState = {
  isLoading: false,
  isAuth: false,
  error: null,
  isJoined: false,
  id: null,
  name: null,
  room: null,
  notif: [],
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_USER:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case SUCESS_LOGIN:
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        id: action.payload.id,
        name: action.payload.name,
        error: null,
      };
    case FAIL_LOGIN:
      return {
        ...state,
        isLoading: false,
        isAuth: false,
        error: action.payload,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        error: null,
        ...action.payload,
      };
      case NOTIFICATION_PUSH:
        return {
          ...state,
          isLoading: false,
          error: null,
          notif: [...state.notif, action.payload]
        }

      case NOTIFICATION_REFRESH:
        return {
          ...state,
          isLoading: false,
          error: null,
          notif: action.payload,
        }

    default:
      return state;
  }
}
