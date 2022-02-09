import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import notifications from "./notif";
import room from "./room";
import invitation from "./invite";
import users from "./users";
import stage from "./stage";
import socket from "./socket";
import rooms from "./rooms";

export default combineReducers({
    auth,
    message,
    notifications,
    room,
    invitation,
    users,
    stage,
    socket,
    rooms,
});