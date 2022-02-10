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

    filterData = (data, select) => {
        console.log("select", select);
        let res = data.map((item) => {return(select(item))});
        return res;
    }

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
            res.users = this.selector.Data(res.users, (({id, name}) => ({id, name})))
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
            let ids = this.selector.Data(updateRoom.users, (({id}) => (id)));
            updateRoom.users = this.selector.Data(updateRoom.users, (({id, name}) => ({id, name})))
            this.io.to(user.id).emit("updateProfile", updateProfile);
            console.log('Users on room joind', ids, updateRoom);
            this.io.to(ids).emit("userJoind", (({ id, name }) => ({ id, name }))(updateProfile));
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
            this.io.emit("updateRooms", this.rooms.getRooms());
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
            // console.log("admin1", room.admin);
            // console.log("roomUsers>>", room.users);
            let user = await this.users.userLeave(socketId);
            if (room.users.length === 0) {
                await this.rooms.deleteRoom(roomId);
                this.io.emit("updateRooms", this.rooms.getRooms());
            } else {
                let usersRoom = this.selector.Data(room.users, (({id}) => (id)))
                if (room.admin === socketId) {
                    let updateRoom = this.rooms.switchAdmin(room.id);
                    // console.log(usersRoom, '<<<<<<<<<<');
                    this.io.to(usersRoom).emit("updateRoom", updateRoom);
                }
                else
                    this.io.to(usersRoom).emit("updateRoom", room);
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
            let filterRoom = allRooms.map((room) => {
                return (
                    (({ id, name, isPravite, admin, status }) =>
                        ({ id, name, isPravite, admin, status }))(room)
                )
            });
            callback(filterRoom, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    }

}


module.exports = RoomController;