
const regexValidete = /^[a-zA-Z0-9]{3,20}$/;

class Users {
  constructor() {
    if (Users.instance instanceof Users) return Users, instance;
    this.users = new Map();
    this.onlineUsers = [];

  }

  getUsers(room) {
    if (this.users.has(room)) {
      return this.users.get(room);
    }
    return [];
  }

  getUser(room, id) {
    let user // created by ali zaynoune 
    // i think you are forget to declaration var user
    if (this.users.has(room)) {
      user = this.users.get(room).filter((user) => user.id == id);
      return user;
    }
    return null;
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    const room = this.users.get(room);
    if (room) {
      room.push(user);
    } else {
      this.users.set(room, [user]);
    }
    return user;
  }

  removeUser(room, id) {
    if (this.users.has(room)) {
      users = this.users.get(room).filter((user) => user.id !== id);
      this.users.set(room, users);
    }
  }

  getUserList() {
    rooms = this.users.keys();
    return rooms;
  }
  login(username, id) {
    console.log(`User connected: ${socket.id}`);
    return Promise((resolve, reject) => {
      username = username.trim().toLowerCase();
      if (!this.regx.test(username)) {
        return reject({ message: "Please enter a valid name" });
      }
      let existingUser = this.onlinesUsers.find(
        (user) => user.name === username
      );
      if (existingUser) {
        return reject({ message: "Username is already taken" });
      }
      let user = { id, username, isJoined: false, room: null, notif: [] };
      this.onlinesUsers.push(user);
      return resolve(user);
    });
  }
  logout(id) {
    console.log(`${id} is logout`);
    return new Promise((resolve, reject) => {
      let indexUser = this.onlinesUsers.findIndex((user) => user.id === id);
      if (indexUser === -1) return reject({ message: "User not login" });
      this.onlinesUsers.splice(indexUser, 1);
      return resolve(this.onlineUsers);
    })

  }
}

module.exports = new Users();
