const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
const Selector = require("../utils/selector")

class InviteController {

    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
        this.selector = new Selector;
    }

    /**
     * @description invite user to room
     * @param {object} socket - socket object 
     * @param {object} data - data object
     * @param {function} callback - (res, err)
     */

    invitation = (socket) => async (data, callback) => {
        console.log(`User ${socket.id} is trying to invite data =>`, data);
        try {
            let user = await this.users.getUser(data.userId);
           if (user.isJoined) return callback(null, {message: `${user.name} is already joined to room`});
            let room = await this.rooms.getRoom(data.roomId);
            console.log(`Room`, room);
            if (room.status !== "waiting") return callback(null, {message: "Room is closed"});
            let isInvited = room.invit.find(item => item.id === socket.id);
            if (isInvited) return callback(null, {message: `${user.name} is already invited to this room`});
            room = await this.rooms.inviteUser({roomId: room.id, userId: user.id, userName: user.name});
            let notif = {
                id: Math.random().toString(36).substr(2) + Date.now().toString(36),
                message: `${user.admin} invited you to ${room.name}`,
                type: "invitation",
            }
            user = await this.users.userNotifications(socket.id, notif);
            this.io.to(user.id).emit("notification", notif);
            return callback(room, null);
        } catch (error) {
            console.log(error);
            if (typeof callback === "function") return callback(null, error);
        }
    }


    changeStatusInvitation = (socket, status) => async (data, callback) => {
        try {

            let user = await this.users.getUser(socket.id);
            console.log(`${socket.id} try to change status invitation data =>`, data, user);
            let notifIndex = user.notif.findIndex((item) => item.id === data.notifId);
            if (notifIndex === -1) return callback(null, { message: "Notification not found" });
            if (user.notif[notifIndex].type !== "invitation") return callback(null, { message: "Notification is not invitation" });
            if (user.notif[notifIndex].read === true) return callback(null, { message: "Notification is already read" });
            user.notif[notifIndex].read = true;
            let room = await this.rooms.getRoom(user.notif[notifIndex].roomId);
            if (room.status !== "waiting") return callback(null, { message: "Room is closed" });
            let invitIndex = room.invit.findIndex((item) => item.userId === socket.id);
            if (invitIndex === -1) return callback(null, { message: "You are not invited in this room" });
            // room.invit[invitIndex].status = status;
            let notifAdmin = {
                id: Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2),
                message: `${user.name} ${status} your invitation`,
            }
            if (status === "accepted"){
                this.rooms.joinRoom({roomId: room.id, userId: user.id, userName: user.name});
                user = await this.users.userJoin(user.id, room.id);
                let notifUsers = {
                    id: Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2),
                    message: `${user.name} join ${room.name}`,
                    type: "notification",
                }
                let userIds = this.selector
                .Data(room.users, (({id}) => id))
                .filter((id) => id !== user.id && id !== room.admin);
                userIds.length && this.io.to(userIds).emit("notification", notifUsers);
                let roomInfo = {...room};
                ['users', 'invit'].forEach((key) => delete roomInfo[key]);
                this.io.to([user.id, userIds]).emit("updateRoom", roomInfo);
                this.io.to(room.admin).emit("updateRoom", room);
            }
            this.io.to(room.admin).emit("notification", notifAdmin);
            return callback(user, null);
        } catch (error) {
            console.log(error);
            return callback(null, error);
        }
    }

}



module.exports = InviteController;