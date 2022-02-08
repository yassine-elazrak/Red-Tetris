import { SUCESS_LOGIN, LOADING_USER, FAIL_LOGIN, UPDATE_USER } from "../types";

const initialState = {
  isLoading: false,
  isAuth: false,
  error: null,
  isJoned: false,
  id: null,
  name: null,
  room: null,
};

// id: "WhDk4XTSWUC47pv6AAAD"
// ​
// isJoned: false
// ​
// name: "dsafff"
// ​
// room: null

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
    case UPDATE_USER:
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        id: action.payload.id,
        name: action.payload.name,
        isJoned: action.payload.isJoned,
        room: action.payload.room,
        error: null,
      };

    default:
      return state;
  }
}
