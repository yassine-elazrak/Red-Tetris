const Rooms = require("../rooms/rooms");
const Users = require("../users/users");

class MessagesController {
    constructor (io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
    }

    sentMessage = (socket) => async (data, callback) => {
        try {
            let user = await this.users.getUser(socket.id);
            let room = await this.rooms.getRoom(data.roomId);
            //console.log('=> room', room, 'socketId =>', socket.id);
            if (!room.users.find(e => e.id === socket.id))
                return callback(null, {message : `you are not member at ${room.name}`});
            let ids = room.users.map(e => e.id).filter(id => id !== socket.id);
            let newMessage = {
                userId : socket.id,
                userName : user.name,
                message: data.message,
                createdAt : new Date,
            }
            ids.length && this.io.to(ids).emit("message", newMessage);
            callback(newMessage, null);
        } catch (error) {
            console.log(error)
            return callback(null, error);
        }
    }
}

module.exports = MessagesController;