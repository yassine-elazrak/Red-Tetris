const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
// const Selector = require("../utils/selector");
const Game = require('../rooms/game');
const _ = require("lodash");

class RoomController {
    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
        this.game = new Game;
        // this.selector = new Selector;
    }

    /**
     * @description create new room
     * @param {string} socket - socke object
     * @param {object} data - room data
     * @param {function} callback - (res, err)
     */
    createRoom = (socket) => async (data, callback) => {
        try {
            let user = await this.users.getUser(socket.id);
            if (user.isJoined)
                return callback(null, { message: "You are already in a room" });
            let res = await this.rooms.createRoom(data, {
                id: user.id,
                name: user.name,
            });

            let userUpdate = await this.users.userJoin(socket.id, res.id);
            this.io.to(user.id).emit("updateProfile", userUpdate);
            this.io.emit("updateUsers", this.users.getUsers());
            this.io.emit("updateRooms", this.rooms.getRooms());
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            console.log(error);
            if (typeof callback === "function") callback(null, error);
        }
    };


    createOrJoinRoom = (socket) => async (data, callback) => {
        //console.log(`${socket.id} try to creat or join room data =>`, data);
        try {
            let user = await this.users.getUser(socket.id);
            if (user.isJoined)
                return callback(null, { message: "You are already in a room" });
            let allRooms = this.rooms.getRooms();
            let trimNameRoom = data.roomName.trim().toLowerCase();
            let room = allRooms.find(item => item.name === trimNameRoom);
            if (room) {
                if (room.status !== 'waiting') return callback(null, { message: "Room is closed2" })
                room = await this.rooms.joinRoom({
                    roomId: room.id,
                    userId: user.id,
                    userName: user.name,
                })
                let ids = room.users.map(e => e.id).filter(id => id !== socket.id && id !== room.admin);
                this.io.to([...ids, room.admin]).emit("notification", {
                    message: `${user.name} is joind ${room.name}`,
                    type: "notification",
                    read: true,
                })
                this.io.to(room.admin).emit("updateRoom", room);
                console.log('admin', room.admin);
                let resUser = _.omit(room, ["invit"]);
                ids.length && this.io.to(ids).emit("updateRoom", resUser);
                let updateProfile = await this.users.userJoin(socket.id, room.id);
                this.io.to(socket.id).emit("updateProfile", updateProfile);
                return callback(resUser, null);

            } else {
                room = await this.rooms.createRoom(data, user);
                this.io.emit("updateRooms", this.rooms.getRooms());
                let updateProfile = await this.users.userJoin(socket.id, room.id);
                this.io.to(socket.id).emit("updateProfile", updateProfile);
                return callback(room, null);
            }

        } catch (error) {
            console.log(error);
            if (typeof callback === "fucntion") return callback(null, error);
        }
    }

    /**
     * @description join to room
     * @param {string} socket.id - socket id
     * @param {id} roomId - room id
     * @param {function} callback - (res, err)
     */
    joinRoom = (socket) => async (roomId, callback) => {
        //console.log(`User ${socket.id} is trying to join room ${roomId}`);
        try {
            let user = await this.users.getUser(socket.id);
            if (user.isJoined)
                return callback(null, { message: "You are already in a room" });
            let room = await this.rooms.joinRoom({
                roomId,
                userId: user.id,
                userName: user.name,
            });
            let updateProfile = await this.users.userJoin(socket.id, roomId);
            let ids = room.users.map(e => e.id)
                .filter(id => id !== socket.id && id !== room.admin);
            let notif = {
                message: `${user.name} joind to ${room.name}`,
                type: "notification",
                read: true,
            };
            this.io.to([...ids, room.admin]).emit("notification", notif);
            this.io.to(user.id).emit("updateProfile", updateProfile);
            this.io.to(room.admin).emit("updateRoom", room)
            // console.log('admin' , room.admin);
            let resUsers = _.omit(room, ['invit', 'message']);
            ids.length && this.io.to(ids).emit("updateRoom", resUsers);
            if (typeof callback === "function") return callback(resUsers, null);
        } catch (error) {
            console.log("error join room =>", error)
            if (typeof callback === "function") return callback(null, error);
        }
    };

    /**
     * @description  close room
     * @param {string} socket.id - socket id
     * @param {id} roomId - room id
     * @param {function} callback - (res, err)
     */
    changeStatusRoom = (socket) => async (data, callback) => {
        try {
            if (!["closed", "paused", "started"].includes(data.status))
                return callback(null, { message: "Invalid action" })
            let res = await this.rooms.changeStatusRoom(
                { roomId: data.roomId, userId: socket.id, status: data.status });
            let ids = res.users.map(e => e.id)
                .filter(id => id !== socket.id);
            let admin = res.users.find((user) => user.id === res.admin);
            let notif = {
                message: `this room ${data.status} by ${admin.name}`,
                type: "notification",
                read: true,
            };
            ids.length && this.io.to(ids).emit("notification", notif);
            let roomInfo = _.omit(res, ['invit', 'message']);
            this.io.emit("updateRooms", this.rooms.getRooms());
            ids.length && this.io.to(ids).emit("updateRoom", roomInfo);
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            console.log(error);
            if (typeof callback === "function") callback(null, error);
        }
    };

    /**
     * @description create new room
     * @param {string} socket.id - socket id
     * @param {id} roomId - room id
     * @param {function} callback - (res, err)
     */
    leaveRoom = (socket) => async (roomId, callback) => {
        try {
            let room = await this.rooms.leaveRoom(socket.id, roomId);
            // console.log("room [[[[[[=>", room);
            let user = await this.users.userLeave(socket.id);
            if (room.users.length === 0) {
                await this.rooms.deleteRoom(roomId);
                this.io.emit("updateRooms", this.rooms.getRooms());
            } else {
                let ids = room.users.map(e => e.id);
                // console.log("ids after leave room => ", ids);
                if (room.admin === socket.id) {
                    let updateRoom = this.rooms.switchAdmin(room.id);
                    let newAdmin = updateRoom.users.find(
                        (user) => user.id === updateRoom.admin
                    );
                    // notification for users
                    let notif = {
                        message: `admin changed to ${newAdmin.name}`,
                        type: "notification",
                        read: true,
                    };
                    ids = ids.filter((id) => id !== newAdmin.id);
                    // notif users admin is switched!
                    ids.length && this.io.to(ids).emit("notification", notif);
                    // update message notification for admin
                    notif.message = "you are admin of this room";
                    // update room at new admin
                    this.io.to(newAdmin.id).emit('updateRoom', updateRoom);
                    let resUses = _.omit(updateRoom, ['invit', 'message']);
                    // update room at users
                    console.log('ids', ids);
                    ids.length && this.io.to(ids).emit("updateRoom", resUses);
                    // notif new admin he is admin now
                    this.io.to(newAdmin.id).emit("notification", notif);
                } else {
                    let notif = {
                        message: `${user.name} left ${room.name}`,
                        type: "notification",
                        read: true,
                    };
                    // nitif all users is a user leave room
                    this.io.to([...ids, room.admin]).emit("notification", notif);
                    this.io.to(room.admin).emit("updateRoom", room);
                    room = _.omit(room, ['invit', 'message']);
                    ids = ids.filter(id => id !== room.admin);
                    console.log('ids2', ids);
                    ids.length && this.io.to(ids).emit("updateRoom", room)
                }
            }
            this.io.to(user.id).emit("updateProfile", user);
            this.io.emit("updateUsers", this.users.getUsers());
            if (typeof callback === "function") callback(null, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };

    gameAction = (socket) => async (data, callback) => {
        try {
            // data = {action, roomId}
            // let room = await this.rooms.getRoom(data.roomId);
            let roomIndex = this.rooms.rooms.findIndex(e => e.id === data.roomId);
            if (roomIndex === -1) return callback(null, { message: "Room not found" });
            let room = this.rooms.rooms[roomIndex];
            // console.log(room, 'room');
            let playerIndex = room.users.findIndex(e => e.id === socket.id)
            if (playerIndex === -1) return callback(null, { message: "You are not joined in this room" });
            // console.log(room.users[playerIndex].currentTetromino);
            if (room.users[playerIndex].currentTetromino.collided
                || !room.users[playerIndex].currentTetromino.shape
            )
                room = this.rooms.changeCurrentTetromino(playerIndex, roomIndex);
            let updateSpacePlayer = await this.game.action(data.action, room.users[playerIndex]);

            // console.log(map);
            // this.rooms.rooms[roomIndex].users[playerIndex] = updateSpacePlayer;
            console.log(updateSpacePlayer);
            callback(updateSpacePlayer, null);
        } catch (error) {
            console.log(error);
            callback(null, error);
        }
    }

    /**
     * @description get current rooms
     * @param {function} callback - (res, err)
     */
    currentRoom = () => (d, callback) => {
        try {
            let allRooms = this.rooms.getRooms()
                .map(e => {
                    return _.pick(e, ['id', 'name', 'isPravite', 'admin', 'status']);
                });
            //console.log(allRooms);
            callback(allRooms, null);
        } catch (error) {
            //console.log(error);
            if (typeof callback === "function") callback(null, error);
        }
    };
}

module.exports = RoomController;
