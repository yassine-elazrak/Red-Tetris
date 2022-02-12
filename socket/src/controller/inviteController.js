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
        try {
            let room = await this.rooms.getRoom(data.roomId);
            let user = await this.users.getUser(data.userId);
            let currentUser = await this.users.getUser(socket.id);
            if (room.invit.findIndex((invit) => invit.userId === data.userId) !== -1)
                return callback(null, { message: "User already invited" });
            // if (user.isJoned)
            //     return callback(null, { message: `${user.name} is already in room` });
            if (room.admin !== socket.id) return callback(null, { message: "You are not admin" });
            if (room.status !== "waiting") return callback(null, { message: "Room is closed" });
            let res = await this.rooms.inviteUser({
                roomId: data.roomId,
                userId: user.id,
                userName: user.name,
                userStatus: "waiting",
            });

            let NewNotif = {
                id: Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2),
                name: currentUser.name,
                roomId: room.id,
                roomName: room.name,
                read: false,
                message: `${currentUser.name} invite you to join ${room.name}`,
                type: "invitation",
            }

            let notifs = await this.users.userNotifications(user.id, NewNotif);
            this.io.to(user.id).emit("notification", NewNotif);
            this.io.to(user.id).emit("updateNotifications", notifs)
            if (typeof callback === "function") return callback(res.invit, null);
        } catch (error) {
            console.log(error);
            if (typeof callback === "function") return callback(null, error);
        }
    }


    changeStatusInvitation = (socketId, status) => async (roomId, callback) => {
        // 'accepted', 'declined', 'waiting'
        try {
            let user = await this.users.getUser(socketId);
            let updateRoom = await this.rooms.changeStatusInvitation({ roomId, userId: socketId, status });
            console.log(updateRoom.users, socketId, status, '<<<<<<<<<<<<<<<<<<<<<');
            if (status === 'accepted') {
                if (user.isJoned) return callback(null, { message: "You are already in a room" });
                let userInfo = updateRoom.users.find(item => item.id === socketId)
                let notif = {
                    message: `${userInfo.name} joind to this room`,
                    type: "notif",
                }
                let ids = this.selector.Data(updateRoom.users, ({ id }) => id)
                    .filter(id => id !== socketId);
                ids.length && this.io.to(ids).emit("notification", notif);
                let profile = await this.users.userJoin(socketId, updateRoom.id);
                this.io.to(updateRoom.admin).emit("updateInvit", updateRoom.invit);
                updateRoom = (({ id, name, admin, isPravite, status, users
                }) => ({
                    id, name, admin, isPravite, status, users
                }))(updateRoom)
                console.log("ids=>",[...ids, socketId], "updateRoom=>" ,updateRoom);
                this.io.to([...ids, socketId]).emit("updateRoom", updateRoom);
                return callback(profile, null);
                // this.io.emit("updateUsers", this.users.getUsers());
            } else {
                this.io.to(updateRoom.admin).emit("updateInvit", updateRoom.invit);
                // let profile = await this.users.userLeave(socketId);
                return callback(profile, null);
            }

        } catch (error) {
            console.log(error, '<<<<<<<<<<<<errrorrr>>>>>>>>>>>>>>');
            return callback(null, error);
        }
    }

}



module.exports = InviteController;