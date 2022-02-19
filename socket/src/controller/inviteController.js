const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
// const Selector = require("../utils/selector")
const _ = require("lodash");

class InviteController {

    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
        // this.selector = new Selector;
    }

    /**
     * @description invite user to room
     * @param {object} socket - socket object 
     * @param {object} data - data object
     * @param {function} callback - (res, err)
     */

    invitation = (socket) => async (data, callback) => {
        // ////console.log(`User ${socket.id} is trying to invite data =>`, data);
        try {
            let user = await this.users.getUser(data.userId);
            let admin = await this.users.getUser(socket.id);
            if (user.isJoined) return callback(null, { message: `${user.name} is already joined to room` });
            let room = await this.rooms.getRoom(data.roomId);
            if (socket.id !== room.admin) return callback(null, { message: `you are not admin of this room` });
            // ////console.log(`Room`, room);
            if (room.invit.find(e => e.userId === data.userId)) return callback(null, { message: `${user.name} is already invited to this room` });
            if (room.status !== "waiting" && room.status !== 'end')
                return callback(null, { message: "Room is closed" });
            if (room.invit.find(item => item.id === socket.id))
                return callback(null, { message: `${user.name} is already invited to this room` });
            room = await this.rooms.inviteUser({ roomId: room.id, userId: user.id, userName: user.name });
            let notif = {
                id: Math.random().toString(36).substr(2) + Date.now().toString(36),
                message: `${admin.name} invited you to ${room.name}`,
                roomId: room.id,
                type: "invitation",
                read: false,
            }
            user = await this.users.userNotifications(user.id, notif);
            this.io.to(user.id).emit("notification", notif);
            return callback(room, null);
        } catch (error) {
            ////console.log(error);
            if (typeof callback === "function") return callback(null, error);
        }
    }


    changeStatusInvitation = (socket, status) => async (data, callback) => {
        try {

            let user = await this.users.getUser(socket.id);
            let notifIndex = user.notif.findIndex((item) => item.id === data.notifId);
            if (notifIndex === -1) return callback(null, { message: "Notification not found" });
            if (user.notif[notifIndex].type !== "invitation") return callback(null, { message: "Notification is not invitation" });
            if (user.notif[notifIndex].read === true) return callback(null, { message: "Notification is already read" });
            user.notif[notifIndex].read = true;
            let room = await this.rooms.getRoom(user.notif[notifIndex].roomId);
            if (room.status !== "waiting" && room.status !== 'end')
                return callback(null, { message: "Room is closed" });
            let invitIndex = room.invit.findIndex((item) => item.userId === socket.id);
            if (invitIndex === -1) return callback(null, { message: "You are not invited in this room" });
            let notifAdmin = {
                id: Math.random().toString(36).substr(2) + Date.now().toString(36),
                message: `${user.name} ${status} your invitation`,
                type: "notification",
                read: true,
            }
            room = await this.rooms.changeStatusInvitation({ roomId: room.id, userId: socket.id, status: status });
            let roomInfo = null;
            if (status === "accepted") {
                user = await this.users.userJoin(user.id, room.id);
                let notifUsers = {
                    id: Math.random().toString(36).substr(2) + Date.now().toString(36),
                    message: `${user.name} join ${room.name}`,
                    type: "notification",
                    read: true,
                }
                let userIds = room.users.map(e => e.id).filter(id => id !== user.id && id !== room.admin);
                ////console.log("userIds2 =>", userIds);
                userIds.length && this.io.to(userIds).emit("notification", notifUsers);
                roomInfo = _.omit(room, ["invit", "users", "ids", 'nextTetromino']);
                let game = room.users.find(u => u.id === socket.id);
                let allPlayers = room.users.map(u => _.omit(u, ['nextTetrominos', 'currentTetromino']))
                this.io.to(room.ids).emit("updateAllPlayers", allPlayers);
                this.io.to(socket.id).emit("updateGame", game)
                this.io.to([user.id, userIds]).emit("updateRoom", roomInfo);
            }
            this.io.to(room.admin).emit("updateRoom", room);
            this.io.to(room.admin).emit("notification", notifAdmin);
            ////console.log("room => ", room);
            return callback({ profile: user, room: roomInfo }, null);
        } catch (error) {
            ////console.log(error);
            return callback(null, error);
        }
    }

}



module.exports = InviteController;