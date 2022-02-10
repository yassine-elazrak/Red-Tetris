const Users = require("../users/users");
const Rooms = require("../rooms/rooms");

class AuthController {

    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
    }

    /**
     * @description accept invetation join room
     * @param {object} socket - socket object
     * @param {object} data - {userName} 
     * @param {function} callback - (res, err)
     */
    login = (socket) => async (data, callback) => {
        // console.log("socket id=>", socket.id, this.io);
        console.log(`User ${socket.id} is trying to login`);
        try {
            let res = await this.users.login(socket.id, data);
            socket.join('online');
            this.io.in('online').emit("updateUsers", this.users.getUsers());
            console.log("res", res);
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };

    /**
     * @description logout user and delet room if empty
     * @param {object} socket - socket object 
     */
    logout = (socket) => async () => {
        try {
            let user = await this.users.getUser(socket.id);
            if (user.isJoned) {
                let room = await this.rooms.leaveRoom(socket.id, user.room);
                if (room.users.length === 0) {
                    let currntRooms = await this.rooms.deleteRoom(room.id);
                    this.io.emit("updateRooms", currntRooms);
                } else {
                    let updateRoom = this.rooms.switchAdmin(room.id);
                    this.io.to(updateRoom.users).emit("updateRoom", updateRoom);
                }
            }
            let allUsers = await this.users.logout(socket.id);
            this.io.emit("updateUsers", allUsers);
        } catch (error) {
            console.log("error", error);
        }
    }
}

module.exports = AuthController;