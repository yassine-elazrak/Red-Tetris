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
            let room = await this.rooms.createRoom(data, {
                id: user.id,
                name: user.name,
            });
            let res = { ...room };
            let userUpdate = await this.users.userJoin(socket.id, room.id);
            this.io.to(user.id).emit("updateProfile", userUpdate);
            this.io.emit("updateUsers", this.users.getUsers());
            this.io.emit("updateRooms", this.rooms.getRooms());
            let game = room.users[0]
            this.io.to(socket.id).emit("updateGame", game)
            res.users = room.users.map(u => { return (_.pick(u, ['id', 'name', 'status'])) })
            return callback(res, null);
        } catch (error) {
            //console.log(error);
           return callback(null, error);
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
                let ids = room.ids.filter(id => id !== socket.id && id !== room.admin);
                this.io.to([...ids, room.admin]).emit("notification", {
                    message: `${user.name} is joind ${room.name}`,
                    type: "notification",
                    read: true,
                })
                this.io.to(room.admin).emit("updateRoom", room);
                let resUser = _.omit(room, ["invit", "users", "ids", 'nextTetromino']);
                let allPlayers = room.users.map(u => _.omit(u, ['nextTetrominos', 'currentTetromino']));
                this.io.to(room.ids).emit('updateAllPlayers', allPlayers);
                let updateProfile = await this.users.userJoin(socket.id, room.id);
                let game = room.users.find(u => u.id === socket.id)
                // //console.log('update game', game, room.users);
                this.io.to(socket.id).emit("updateGame", game);
                this.io.to(socket.id).emit("updateProfile", updateProfile);
                return callback(resUser, null);
            } else {
                room = await this.rooms.createRoom(data, user);
                this.io.emit("updateRooms", this.rooms.getRooms());
                let updateProfile = await this.users.userJoin(socket.id, room.id);
                this.io.to(socket.id).emit("updateGame", room.users[0]);
                this.io.to(socket.id).emit("updateProfile", updateProfile);
                return callback(room, null);
            }

        } catch (error) {
            //console.log(error);
            return callback(null, error);
        }
    }

    /**
     * @description join to room
     * @param {string} socket.id - socket id
     * @param {id} roomId - room id
     * @param {function} callback - (res, err)
     */
    joinRoom = (socket) => async (roomId, callback) => {
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
            let ids = room.ids.filter(id => id !== socket.id && id !== room.admin);
            let notif = {
                message: `${user.name} joind to ${room.name}`,
                type: "notification",
                read: true,
            };
            this.io.to([...ids, room.admin]).emit("notification", notif);
            this.io.to(user.id).emit("updateProfile", updateProfile);
            this.io.to(room.admin).emit("updateRoom", room)
            let resUsers = _.omit(room, ["invit", "users", "ids", 'nextTetromino']);
            let allPlayers = room.users.map(u => _.omit(u, ['nextTetrominos', 'currentTetromino']))
            this.io.to(room.ids).emit("updateAllPlayers", allPlayers);
            let game = room.users.find(u => u.id === socket.id)
            this.io.to(socket.id).emit("updateGame", game);
           return callback(resUsers, null);
        } catch (error) {
            //console.log("error join room =>", error)
             return callback(null, error);
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
                let leaveIds = room.ids.filter(id => {
                    if (!room.users.find(u => u.id === id)) return id
                })
                room.ids = room.users.map(u => u.id)
                leaveIds.forEach(id => {
                    let user = this.users.users.find(u => u.id === id)
                    if (user) {
                        user.isJoined = false;
                        this.io.to(id).emit('leaveRoom', user);
                    }
                });
                let allPlayers = room.users.map(u => _.omit(u, ['nextTetrominos', 'currentTetromino']))
                this.io.to(room.ids).emit("updateAllPlayers", allPlayers);
            }
            let ids = room.ids.filter(id => id !== socket.id);
            let admin = room.users.find((user) => user.id === room.admin);
            let notif = {
                message: `this room ${data.status} by ${admin.name}`,
                type: "notification",
                read: true,
            };
            ids.length && this.io.to(ids).emit("notification", notif);
            let roomInfo = _.omit(room, ["invit", "users", "ids", 'nextTetromino']);
            this.io.emit("updateRooms", this.rooms.getRooms());
            ids.length && this.io.to(ids).emit("updateRoom", roomInfo);
            //console.log(oldStatus);
            return callback(room, null);
        } catch (error) {
            //console.log(error);
            return callback(null, error);
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
                let ids = room.ids;
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
                    let resUses = _.omit(updateRoom, ["invit", "users", "ids", 'nextTetromino']);
                    // update room at users
                    //console.log('ids', ids);
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
                    let roomRes = _.omit(room, ["invit", "users", "ids", 'nextTetromino']);
                    ids = ids.filter(id => id !== room.admin);
                    ids.length && this.io.to(ids).emit("updateRoom", roomRes)
                }
                // //console.log(room);
                let allPlayers = room.users.map(u => _.omit(u, [['nextTetrominos', 'currentTetromino']]))
                if (room.users.length === 1 && room.status !== "wainting" && room.status !== 'end'){
                    room.status = 'end',
                    room.users[0].status = 'gameWinner'
                    let game = room.users[0];
                    this.io.to(room.users[0].id).emit('updateGame', game)
                    this.io.to(room.users[0].id).emit('updateRoom', room);
                    this.io.emit('updateRooms', this.rooms.getRooms());
                }
                this.io.to(room.ids).emit('updateAllPlayers', allPlayers);
            }
            this.io.to(user.id).emit("updateProfile", user);
            this.io.emit("updateUsers", this.users.getUsers());
            return callback(null, null);
        } catch (error) {
            //console.log(error);
            return callback(null, error);
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
            // players
            let playersEmit = _.omit(updateSpacePlayer, ['nextTetrominos', 'currentTetromino'])
            let idsEmit = room.ids.filter(id => id !== socket.id);
            idsEmit.length && this.io.to(idsEmit).emit('updateOnePlayer', playersEmit)
            if (room.status === 'end') {
                this.io.emit("updateRooms", this.rooms.getRooms());
                //console.log('updater', room);
                let resUsers = {...room};
                resUsers.users = room.users.map(u => {
                    return _.pick(u, ['id', 'name', 'status'])
                });
                this.io.to(room.admin).emit('updateRoom', resUsers);
                let ids = room.ids.filter(id => id !== room.admin);
                resUsers = _.omit(room, ["invit", "users", "ids", 'nextTetromino']);
                ids.length && this.io.to(ids).emit('updateRoom', resUsers);
                let winner = room.users.find(u => u.status === 'gameWinner')
                idsEmit = idsEmit.filter(i => i !== winner.id);
                idsEmit.length && this.io.to(idsEmit).emit("updateOnePlayer", winner);
                winner && this.io.to(winner.id).emit('updateGame', winner);
            }
            callback(updateSpacePlayer, null);
        } catch (error) {
            callback(null, error);
        }
    }

    gameContinue = (socket) => async (data, callback) => {
        try {
            let room = await this.rooms.getRoom(data.roomId);
            let userIndex = room.users.findIndex(u => u.id === socket.id)
            if (userIndex === -1) return callback(null, { message: "You are not joined in this room" });
            this.game.resetGame(room.users[userIndex], room.nextTetromino);
            this.io.to(room.admin).emit('updateRoom', room);
            return callback({ game: room.users[userIndex], room }, null);
        } catch (error) {
            //console.log(error);
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
            return callback(null, error);
        }
    };
}

module.exports = RoomController;
