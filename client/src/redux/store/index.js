import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import socketMiddleware from "../middleware/middleware";

const middleware = [socketMiddleware, thunk];
const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  storeEnhancers(applyMiddleware(...middleware))
);
