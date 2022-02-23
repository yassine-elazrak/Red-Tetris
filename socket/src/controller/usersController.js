const Users = require("../users/users");
const Rooms = require("../rooms/rooms");

class UsersController {

  constructor(io) {
    this.io = io;
    this.users = new Users;
    this.rooms = new Rooms;
  }

  /**
   * @description get online users
   * @param {null} _ - null
   * @param {function} callback - (res, err)
   */
  onlineUsers = () => (_, callback) => {
    try {
      let res = this.users.getUsers();
      return callback(res, null);
    } catch (error) {
      return callback(null, error);
    }
  }



}


module.exports = UsersController;