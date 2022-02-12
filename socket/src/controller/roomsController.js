const Users = require("../users/users");
const Rooms = require("../rooms/rooms");
const Selector = require("../utils/selector");

class RoomController {
    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
        this.selector = new Selector;
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
            let res = await this.rooms.createRoom(data, {
                id: user.id,
                name: user.name,
            });
            let userUpdate = await this.users.userJoin(socketId, res.id);
            this.io.to(user.id).emit("updateProfile", userUpdate);
            this.io.emit("updateUsers", this.users.getUsers());
            this.io.emit("updateRooms", this.rooms.getRooms());
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };


    createOrJoinRoom = (socketId) => async (data, callback) => {
        console.log(`${socketId} try to creat or join room data =>`, data);
        try {
            let user = await this.users.getUser(socketId);
            if (user.isJoned)
                return callback(null, { message: "You are already in a room" });
            let allRooms = this.rooms.getRooms();
            let trimNameRoom = data.roomName.trim().toLowerCase();
            let room = allRooms.find(item => item.name === trimNameRoom);
            if (room) {
                if (room.status !== 'waiting') return callback(null, { message: "Room is closed" })
                room = await this.rooms.joinRoom({
                    roomId: room.id,
                    userId: user.id,
                    userName: user.name,
                })
                let ids = this.selector
                    .Data(room.users, (({ id }) => id))
                    .filter(id => id !== socketId && id !== room.admin)
                ids.length && this.io.to([...ids, room.admin]).emit("notification", {
                    message: `${user.name} is joind to this room`,
                    type: "notif",
                })
                this.io.to(room.admin).emit("updateRoom", room);
                let resUser = { ...room };
                ["invit", "message"].forEach(e => delete resUser[e]);
                ids.length && this.io.to(ids).emit("updateRoom", resUser);
                let updateProfile = await this.users.userJoin(socketId, room.id);
                this.io.to(socketId).emit("updateProfile", updateProfile);
                return callback(resUser, null);

            } else {
                room = await this.rooms.createRoom(data, user);
                this.io.emit("updateRooms", this.rooms.getRooms());
                let updateProfile = await this.users.userJoin(socketId, room.id);
                this.io.to(socketId).emit("updateProfile", updateProfile);
                return callback(room, null);
            }

        } catch (error) {
            console.log(error);
            if (typeof callback === "fucntion") return callback(null, error);
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
            if (user.isJoned)
                return callback(null, { message: "You are already in a room" });
            let updateRoom = await this.rooms.joinRoom({
                roomId,
                userId: user.id,
                userName: user.name,
            });
            let updateProfile = await this.users.userJoin(socketId, roomId);
            let ids = this.selector
                .Data(updateRoom.users, ({ id }) => id)
                .filter((id) => id !== socketId);
            let notif = {
                message: `${user.name} joind to this room`,
                type: "notif",
            };
            this.io.to(ids).emit("notification", notif);
            this.io.to(user.id).emit("updateProfile", updateProfile);
            this.io.to(updateRoom.admin).emit("updateRoom", updateRoom)
            let resUsers = { ...updateRoom }
            ["invit", "message"].forEach(e => delete resUsers[e]);
            this.io.to(ids).emit("updateRoom", resUsers);
            if (typeof callback === "function") callback(resUsers, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };

    /**
     * @description  close room
     * @param {string} socketId - socket id
     * @param {id} roomId - room id
     * @param {function} callback - (res, err)
     */
    changeStatusRoom = (socketId, status) => async (roomId, callback) => {
        try {
            let res = await this.rooms.changeStatusRoom({ roomId, userId: socketId, status });
            let ids = this.selector
                .Data(res.users, ({ id }) => id)
                .filter((id) => id !== socketId);
            let admin = res.users.find((user) => user.id === res.admin);
            let notif = {
                message: `this room closed by ${admin.name}`,
                type: "notif",
            };
            ids.length && this.io.to(ids).emit("notification", notif);
            let roomInfo = { ...res };
            ["invit", "message"].forEach(e => delete roomInfo[e]);
            this.io.emit("updateRooms", this.rooms.getRooms());
            ids.length && this.io.to(ids).emit("updateRoom", roomInfo);
            if (typeof callback === "function") callback(res, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };

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
                let usersRoom = this.selector.Data(room.users, ({ id }) => id);
                if (room.admin === socketId) {
                    let updateRoom = this.rooms.switchAdmin(room.id);
                    let newAdmin = updateRoom.users.find(
                        (user) => user.id === updateRoom.admin
                    );
                    let notif = {
                        message: `admin changed to ${newAdmin.name}`,
                        type: "notif",
                    };
                    usersRoom = usersRoom.filter((id) => id !== newAdmin.id);
                    usersRoom.length && this.io.to(usersRoom).emit("notification", notif);
                    notif = { ...notif, message: `you are admin of this room` };
                    this.io.to(newAdmin.id).emit('updateRoom', updateRoom);
                    let resUses = { ...updateRoom }
                    ["invit", "message"].forEach(e => delete resUses[e]);
                    usersRoom && this.io.to(...usersRoom).emit("updateRoom", resUses);
                    this.io.to(newAdmin.id).emit("notification", notif);
                } else {
                    room = (({
                        id, name, admin, isPravite, status, users
                    }) => ({
                        id, name, admin, isPravite, status, users
                    }))(room);
                    let notif = {
                        message: `${user.name} left this room`,
                        type: "notif",
                    };
                    this.io.to(usersRoom).emit("updateRoom", room)
                    usersRoom.length && this.io.to(usersRoom).emit("notification", notif);
                }
            }
            this.io.to(user.id).emit("updateProfile", user);
            this.io.emit("updateUsers", this.users.getUsers());
            if (typeof callback === "function") callback(null, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };

    /**
     * @description get current rooms
     * @param {function} callback - (res, err)
     */
    currentRoom = () => async (_, callback) => {
        try {
            let allRooms = this.rooms.getRooms();
            allRooms = this.selector.Data(
                allRooms,
                ({ id, name, isPravite, admin, status, users }) => ({
                    id,
                    name,
                    isPravite,
                    admin,
                    status,
                })
            );
            callback(allRooms, null);
        } catch (error) {
            if (typeof callback === "function") callback(null, error);
        }
    };
}

module.exports = RoomController;
