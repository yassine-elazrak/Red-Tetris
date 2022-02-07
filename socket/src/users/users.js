class Users {
  constructor() {
    if (Users.instance instanceof Users) {
      return Users.instance;
    }
    this.users = [];
    this.regx = /^[a-zA-Z0-9\s]{3,15}$/;

    Users.instance = this;
  }

  login = (id, name) => {
    return new Promise((resolve, reject) => {
      let trimName = name.trim().toLowerCase();
      if (!this.regx.test(trimName)) {
        return reject({ message: "Name is invalid" });
      }
      let existingUser = this.users.find((user) => user.name === trimName);
      if (existingUser) {
        return reject({ message: "Username is already taken" });
      }
      let user = { id, name: trimName, isJoned: false, room : null };
      this.users.push(user);
      return resolve(user);
    });
  };

  getUsers = () => {
    return this.users;
  };

  removeUser = (id) => {
    return new Promise((resolve, reject) => {
      const index = this.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        return resolve(this.users.splice(index, 1)[0]);
      }
      return reject("User not found");
    });
  };

  getUser = (id) => {
    return new Promise((resolve, reject) => {
      const user = this.users.find((user) => user.id === id);
      if (user) {
        return resolve(user);
      }
      return reject({ message: "User not found" });
    });
  };

  joinRoom = (id, room) => {
    return new Promise((resolve, reject) => {
      const index = this.users.findIndex((user) => user.id === id);
      if (!index === -1) {
        return reject({ message: "User not found" });
      }
        this.users[index] = { ...this.users[index], room, isJoned: true };
    //   this.users.update(user);
      return resolve(this.users[index]);
    });
  }
}

module.exports = Users;
