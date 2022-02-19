import {
  CURRENT_ONLINE_USERS,
  LOADING_ONLINE_USERS,
  ONLINE_USERS_ERROR,
} from "../types";

const initialState = {
  isLoading: false,
  error: null,
  online: [
    // userId: userId,
    // userName: userName,
    // loggedAt: loggedAt,
  ],
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_ONLINE_USERS:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case CURRENT_ONLINE_USERS:
      return {
        ...state,
        error: null,
        isLoading: false,
        online: action.payload,
      };

    case ONLINE_USERS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
