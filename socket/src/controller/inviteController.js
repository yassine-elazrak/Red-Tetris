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
            if (user.isJoned)
                return callback(null, { message: `${user.name} is already in room` });
            if (room.status !== "waiting")
                return callback(null, { message: "Room is closed2" });
            if (room.admin !== socket.id)
                return callback(null, { message: "You are not admin" });
            let res = await this.rooms.inviteUser({
                roomId: data.roomId,
                userId: user.id,
                userName: user.name,
                userStatus: "waiting",
            });

            let notif = await this.users.userInvitation(user.id, {
                id: socket.id,
                name: currentUser.name,
                roomId: room.id,
                roomName: room.name,
                read: false,
                message: `${currentUser.name} invite you to join ${room.name}`,
                type: "invitation",
            });
            this.io.to(user.id).emit("notification", notif);
            if (typeof callback === "function") return callback(res.invit, null);
        } catch (error) {
            console.log(error);
            if (typeof callback === "function") return callback(null, error);
        }
    }

    /**
     * @description accept invetation join room
     * @param {object} socket - socket object 
     * @param {object} data - data object
     * @param {function} callback - (res, err)
     */
    acceptInvitation = (socket) => async (data, callback) => { }

    /**
     * @description decline invetation join room
     * @param {object} socket - socket object 
     * @param {object} data - data object
     * @param {function} callback - (res, err)
     */
    declineInvitation = (socket) => async (data, callback) => { }


    changeStatusInvitation = (socketId, status) => async (roomId, callback) => {
        // 'accepted', 'declined', 'waiting'
        try {
            let user = await this.users.getUser(socketId);
            if (user.isJoned) return callback(null, {message: "You are already in a room"});
            let updateRoom = this.rooms.changeStatusInvitation({roomId, userId : socketId, status});
            if (status === 'accepted'){
                let userInfo = updateRoom.users.findIndex(user => user.id === socketId)
                let notif = {
                    message: `${userInfo.name} joind to this room`,
                    type: "notif",
                }
                let ids = this.selector.Data(updateRoom.users, ({id}) => id);
                ids.filter(id => id !== socketId);
                ids.length && this.io.to(ids).emit("notification", notif);
                this.io.to(updateRoom.admin).emit("updateInvit", updateRoom.invit);
                let profile = await this.users.userJoin(socketId, updateRoom.id);
                return callback(profile, null);
                // this.io.emit("updateUsers", this.users.getUsers());
            } else {
                let profile = this.users.userLeave(socketId);
                return callback(profile, null);
            }
            
        } catch (error) {
            return callback(null, error);
        }
    }

}



module.exports = InviteController;