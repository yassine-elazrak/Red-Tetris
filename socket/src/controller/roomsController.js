const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
const Selector = require("../utils/selector")


class RoomController {
    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
        this.selector = new Selector;
    }

    // filterData = (data, select) => {
    //     console.log("select", select);
    //     let res = data.map((item) => { return (select(item)) });
    //     return res;
    // }

    /**
     * @description create new room
     * @param {string} socketId - socket id
     * @param {object} data - room data 
     * @param {function} callback - (res, err)
     */
    createRoom = (socketId) => async (data, callback) => {
        try {
            let user = await this.users.getUser(socketId);
            if (user.isJoned)
                return callback(null, { message: "You are already in a room" });
            let res = await this.rooms.createRoom(data, { id: user.id, name: user.name });
            let userUpdate = await this.users.userJoin(socketId, res.id);
            res.users = this.selector.Data(res.users, (({ id, name }) => ({ id, name })))
            // console.log('create Room', res);
            this.io.to(user.id).emit("updateProfile", userUpdate);
            this.io.emit("updateUsers", this.users.getUsers());
            this.io.emit("updateRooms", this.rooms.getRooms());
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            console.log(error, "error");
            if (typeof callback === "function") callback(null, error);
        }
    }

    /**
     * @description join to room
     * @param {string} socketId - socket id
     * @param {id} roomId - room id 
     * @param {function} callback - (res, err)
     */
    joinRoom = (socketId) => async (roomId, callback) => {
        console.log(`User ${socketId} is trying to join room ${roomId}`);
        try {
            let user = await this.users.getUser(socketId);
            if (user.isJoned) return callback(null, { message: "You are already in a room" });
            if (user.isJoned)
                return callback(null, { message: "You are already in a room" });
            let updateRoom = await this.rooms.joinRoom({ roomId, userId: user.id, userName: user.name });
            let updateProfile = await this.users.userJoin(socketId, roomId);
            let res = (({ id, name, isPravite, admin, status }) => ({ id, name, isPravite, admin, status }))(updateRoom);
            let ids = this.selector.Data(updateRoom.users, (({ id }) => (id))).filter(id => id !== socketId)
            updateRoom.users = this.selector.Data(updateRoom.users, (({ id, name }) => ({ id, name })))
            let notif = {
                message: `${user.name} is joind to this room`,
                type: "notif",
            }
            this.io.to(user.id).emit("updateProfile", updateProfile);
            this.io.to(ids).emit("notification", notif); // notif
            this.io.to(updateRoom.admin).emit("updateRoom", updateRoom);
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            console.log(error, "error");
            if (typeof callback === "function") callback(null, error);
        }
    }

    /**
     * @description  close room
     * @param {string} socketId - socket id
     * @param {id} roomId - room id 
     * @param {function} callback - (res, err)
     */
    closeRoom = (socketId) => async (roomId, callback) => {
        try {
            let res = await this.rooms.closeRoom(roomId, socketId);
            let ids = this.selector.Data(res.users, (({ id }) => (id))).filter(id => id !== socketId);
            let admin = res.users.find(user => user.id === res.admin);
            let notif = {
                message: `this room closed by ${admin.name}`,
                type: "notif"
            }
            this.io.emit("updateRooms", this.rooms.getRooms());
            this.io.to(ids).emit("notification", notif)
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    }

    /**
     * @description create new room
     * @param {string} socketId - socket id
     * @param {id} roomId - room id 
     * @param {function} callback - (res, err)
     */
    leaveRoom = (socketId) => async (roomId, callback) => {
        try {
            let room = await this.rooms.leaveRoom(socketId, roomId);
            let user = await this.users.userLeave(socketId);
            if (room.users.length === 0) {
                await this.rooms.deleteRoom(roomId);
                this.io.emit("updateRooms", this.rooms.getRooms());
            } else {
                let usersRoom = this.selector.Data(room.users, (({ id }) => (id)))
                if (room.admin === socketId) {
                    let updateRoom = this.rooms.switchAdmin(room.id);
                    let newAdmin = updateRoom.users.find(user => user.id === room.admin);
                    let notif = {
                        message: `admin changed to ${newAdmin.name}`,
                        type: "notif",
                    }
                    usersRoom = usersRoom.filter(id => id !== newAdmin.id);
                    this.io.to(usersRoom).emit("notification", notif);
                    notif = { ...notif, message: `your are admin of this room` }
                    this.io.to(newAdmin.id).emit("notification", notif);
                }
                else {
                    let notif = {
                        message: `${user.name} left this room`,
                        type: "notif",
                    }
                    this.io.to(usersRoom).emit("notification", notif);
                    this.io.to(usersRoom).emit("updateRoom", room);
                }
            }
            this.io.to(user.id).emit("updateProfile", user);
            this.io.emit("updateUsers", this.users.getUsers());
            if (typeof callback === "function") callback(null, null);
        } catch (error) {
            console.log(error, "error");
            if (typeof callback === "function") callback(null, error);
        }
    }

    /**
     * @description get current rooms
     * @param {function} callback - (res, err)
     */
    currentRoom = () => async (_, callback) => {
        try {
            let allRooms = this.rooms.getRooms();
            allRooms = this.selector.Data(allRooms,
                (({ id, name, isPravite, admin, status }) => ({ id, name, isPravite, admin, status })))
            callback(allRooms, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    }

}


module.exports = RoomController;