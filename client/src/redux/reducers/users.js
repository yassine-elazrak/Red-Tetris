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

const generateRandomUser = (value) => {
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push({
      id: i,
      name: Math.random().toString(36).substring(7),
    });
  }
  const newusers = users.filter((user) =>
    user.name.toLowerCase().includes(value.toLowerCase())
  );
  return newusers;
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
