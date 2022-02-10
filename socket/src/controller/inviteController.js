const Users = require("../users/users");
const Rooms = require("../rooms/rooms");


class InviteController {

    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
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
                callback(null, { message: "Room is closed2" });
            if (room.admin !== socket.id)
                callback(null, { message: "You are not admin" });
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
            this.io.to(room.users).emit("updateRoom", room);
            if (typeof callback === "function") callback(res.invit, null);
        } catch (error) {
            console.log(error);
            if (typeof callback === "function") callback(null, error);
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

}



module.exports = InviteController;