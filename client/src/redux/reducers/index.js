import { combineReducers } from "redux";
import profile from "./profile";
import message from "./message";
import notifications from "./notif";
import room from "./room";
import invitation from "./invite";
import users from "./users";
import stage from "./stage";
import socket from "./socket";
import rooms from "./rooms";
import game from './game';
import players from './players';

export default combineReducers({
    profile,
    message,
    notifications,
    room,
    invitation,
    users,
    stage,
    socket,
    rooms,
    game,
    players,
});