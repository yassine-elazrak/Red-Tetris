const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
// const Selector = require("../utils/selector");
const Game = require('../rooms/game');
const _ = require("lodash");

class RoomController {
    constructor(io) {
        // if (RoomController.instance instanceof RoomController) {
        //     return RoomController.instance;
        // }
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
        this.game = new Game;
        // RoomController.instance = this;
        // this.selector = new Selector;
    }

    /**
     * @description create new room
     * @param {object} socket - socke object
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
        try {
            let user = await this.users.getUser(socket.id);
            if (user.isJoined)
                return callback(null, { message: "You are already in a room" });
            let allRooms = this.rooms.getRooms();
            let trimNameRoom = data.roomName.trim().toLowerCase();
            let room = allRooms.find(item => item.name === trimNameRoom);
            if (room) {
                if (room.status !== 'waiting' && room.status !== 'end')
                    return callback(null, { message: "Room is closed" })
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
                return callback(null, { message: "Invalid action" });
            let room = await this.rooms.getRoom(data.roomId);
            let oldStatus = room.status;
            await this.rooms.changeStatusRoom(
                { userId: socket.id, status: data.status }, room);
            if (oldStatus === 'end') {
                // console.log(room.users);
                let leaveIds = room.ids.filter(id => {
                    if (!room.users.find(u => u.id === id)) return id
                })
                room.ids = room.users.map(u => u.id)
                console.log('leave', leaveIds, 'newIds', room.ids);
                leaveIds.forEach(id => {
                    let user = this.users.users.find(u => u.id === id)
                    user.isJoined = false;
                    this.io.to(id).emit('leaveRoom', user);
                });
            }
            let ids = room.ids.filter(id => id !== socket.id);
            let admin = room.users.find((user) => user.id === room.admin);
            let notif = {
                message: `this room ${data.status} by ${admin.name}`,
                type: "notification",
                read: true,
            };
            ids.length && this.io.to(ids).emit("notification", notif);
            let roomInfo = _.omit(room, ['invit', 'message']);
            this.io.emit("updateRooms", this.rooms.getRooms());
            ids.length && this.io.to(ids).emit("updateRoom", roomInfo);
            console.log(oldStatus);
            if (typeof callback === "function") callback(room, null);
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
            let roomIndex = this.rooms.rooms.findIndex(e => e.id === data.roomId);
            if (roomIndex === -1) return callback(null, { message: "Room not found" });
            let room = this.rooms.rooms[roomIndex];
            let playerIndex = room.users.findIndex(e => e.id === socket.id)
            if (playerIndex === -1) return callback(null, { message: "You are not joined in this room" });
            if (room.users[playerIndex].currentTetromino.collided
                || !room.users[playerIndex].currentTetromino.shape
            )
                room = this.rooms.changeCurrentTetromino(playerIndex, roomIndex);
            let updateSpacePlayer = await this.game.action(data.action, room.users[playerIndex],
                this.rooms.rooms[roomIndex]);
            if (room.status === 'end') {
                this.io.emit("updateRooms", this.rooms.getRooms());
                console.log('updater', room);
                this.io.to(room.ids).emit('updateRoom', room);
            }
            callback(updateSpacePlayer, null);
        } catch (error) {
            console.log(error, 'error<<<<<<<');
            callback(null, error);
        }
    }

    gameContinue = (socket) => async (data, callback) => {
        try {
            let room = await this.rooms.getRoom(data.roomId);
            let userIndex = room.users.findIndex(u => u.id === socket.id)
            if (userIndex === -1) return callback(null, { message: "You are not joined in this room" });
            this.game.resetGame(room.users[userIndex],room.nextTetromino);
            return callback({ game: room.users[userIndex], room }, null);
        } catch (error) {
            console.log(error);
            return callback(null, error);
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
            callback(allRooms, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };
}

module.exports = RoomController;
