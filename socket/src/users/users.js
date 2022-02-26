const _ = require('lodash');
class Users {
  constructor() {
    if (Users.instance instanceof Users) {
      return Users.instance;
    }
    this.users = [
      /**
       * @content
       * @param {string} id - user id
       * @param {string} username - user username
       * @param {boolean} isJoined - user is joined in room
       * @param {string} room - room id
       * @param {array} notifications - user notifications
       */
    ];
    this.regx = /^[a-zA-Z0-9\-\s]{3,15}$/;

    Users.instance = this;
  }

  /**
   * @description login user
   * @param {string} id - socket id 
   * @param {string} name - user name 
   * @returns user object or error object
   */
  login = (id, name) => {
    return new Promise((resolve, reject) => {
      let trimName = name.trim().toLowerCase();
      if (!this.regx.test(trimName)) {
        return reject({ message: "Please enter a valid name" });
      }
      let existingUser = this.users.find((user) => user.name === trimName);
      if (existingUser) {
        return reject({ message: "Username is already taken" });
      }
      let user = { id, name: trimName, isJoined: false, room: null, notif: [] };
      this.users.push(user);
      return resolve(user);
    });
  };

  /**
   * @description logout user
   * @param {string} id - socket id 
   * @returns online users object or error object
   */
  logout = (id) => {
    // console.log(`${id} is logout`);
    return new Promise((resolve, reject) => {
      let index = this.users.findIndex((user) => user.id === id);
      if (index === -1) return reject({ message: "User not login" });
      this.users.splice(index, 1);
      return resolve(this.getUsers());
    });
  };

  /**
   * @description get online users
   * @returns online users object
   */
  getUsers = () => {
    let res = this.users.map((user) => {
      return _.pick(user, ['id', 'name', 'isJoined']);
    });
    return res;
  };


  /**
   * @description get user by id
   * @param {string} id - user id
   * @returns user object or error object
   */
  getUser = (id) => {
    return new Promise((resolve, reject) => {
      const user = this.users.find((user) => user.id === id);
      if (user) return resolve(user);
      return reject({ message: "User not found" });
    });
  };

  /**
   * @description user leave room
   * @param {string} id - user id 
   * @returns user profile object or error object
   */
  userLeave = (id) => {
    return new Promise((resolve, reject) => {
      let index = this.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        let user = { ...this.users[index], room: null, isJoined: false };
        this.users[index] = user;
        return resolve(this.users[index]);
      }
      return reject({ message: "User not found" });
    });
  };

  /**
   * @description join user to room
   * @param {string} id - user id
   * @param {string} room - room id
   * @returns 
   */
  userJoin = (id, room) => {
    return new Promise((resolve, reject) => {
      const index = this.users.findIndex((user) => user.id === id);
      if (index === -1) return reject({ message: "User not found" });
      this.users[index] = { ...this.users[index], room, isJoined: true };
      return resolve(this.users[index]);
    });
  }


  /**
  //  * 
  //  * @param {string} userId - user id 
  //  * @param {string} notifId - notification id 
  //  * @returns notification object or error object
  //  */
  // userGetNotif = (userId, notifId) => {
  //   return new Promise((resolve, reject) => {
  //     let userIndex = this.users.findIndex((user) => user.id === userId);
  //     if (userIndex === -1) return reject({ message: "User not found" });
  //     let notifIndex = this.users[userIndex].notif.findIndex((notif) => notif.id === notifId);
  //     if (notifIndex === -1) return reject({ message: "Notification not found" });
  //     return resolve(this.users[userIndex].notif[notifIndex]);
  //   });
  // }

  userNotifications = (id, notif) => {
    return new Promise((resolve, reject) => {
      let index = this.users.findIndex((user) => user.id === id);
      if (index === -1) return reject({ message: "User not found" });
      this.users[index].notif.push(notif);
      return resolve(this.users[index]);
    });
  }

  // userCahngeNotifStatus = (userId, notifId, status) => {
  //   // console.log(userId, notifId, status)
  //   return new Promise((resolve, reject) => {
  //     let userIndex = this.users.findIndex(item => item.id === userId);
  //     // if (userIndex === -1) return reject({message: "User not found"});
  //     let notifIndex = this.users[userIndex].notif.findIndex(item => item.id === notifId);
  //     if (notifIndex === -1) return reject({ message: "Notification not found" });
  //     if (this.users[userIndex].notif[notifIndex].read) return reject({ message: "This notification is already read" });
  //     this.users[userIndex].notif[notifIndex].status = status;
  //     this.users[userIndex].notif[notifIndex].read = true;
  //     resolve(this.users[userIndex].notif);
  //   })

  // }

}

module.exports = Users;
