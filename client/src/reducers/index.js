import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import notif from "./notif";
import room from "./room";
import invite from "./invite";
import users from "./users";

export default combineReducers({
    auth,
    message,
    notif,
    room,
    invite,
    users,
});