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
    console.log("onlineUsers");
    try {
      let res = this.users.getUsers();
      if (typeof callback === "function") callback(res, null);
    } catch (error) {
      console.log("error", error);
      if (typeof callback === "function") callback(null, error);
    }
  }

  

}


module.exports = UsersController;