const Users = require("../users/users");
const Rooms = require("../rooms/rooms");

class UsersController {

    constructor(io) {
        this.io = io;
        this.users = new Users;
        this.rooms = new Rooms;
    }

    onlineUsers = () => (_, callback) =>{
        try {
            let res = this.userssers.getUsers();
            if (typeof callback === "function") callback(res, null);
          } catch (error) {
            if (typeof callback === "function") callback(null, error);
          }
    }



}


module.exports = UsersController;