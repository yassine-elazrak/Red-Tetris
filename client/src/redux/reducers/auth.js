import { SUCESS_LOGIN, IS_LOADING, FAIL_LOGIN } from "../types";

const initialState = {
  isLoading: false,
  isAuth: false,
  error: null,
  id: null,
  name: "",
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case IS_LOADING:
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

    default:
      return state;
  }
}
