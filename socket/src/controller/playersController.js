const Players = require('../rooms/players')
const Rooms = require('../rooms/rooms')
const Users = require('../users/users')
class PlaysersController {
    constructor(io) {
        this.io = io;
        this.rooms = new Rooms;
        this.users = new Users;
    }

    move = (socket) => async (data, callback) => {
        try {
            let room = this.rooms.getRoom(data.roomId);
            let userIndex = room.users.findIndex(e => e.id === socket.id)
            if (userIndex === -1) return callback(null, { message: "You are not joined in this room" });
            let user = room.users[userIndex];
            if (room.status !== 'start') return callback(null, { message: "This room not started yet" });
            if (user.currnetTetromino.shapeIndex === 0 || user.currnetTetromino.collided)
                room = this.rooms.changeCurrentTetromino(userIndex, room);
            console.log("room", room);
            return callback(room, null)
        } catch (error) {
            callback(null, error);
        }
    }

}

module.exports = PlaysersController;
