class Users {
  constructor() {
    if (Users.instance instanceof Users) {
      return Users.instance;
    }
    this.users = [];
    this.regx = /^[a-zA-Z0-9\s]{3,15}$/;

    Users.instance = this;
  }

  addNewUser = async (id, name) => {
    return new Promise((resolve, reject) => {
      const trimNmae = name.trim().toLowerCase();
      if (!this.regx.test(trimNmae)) {
        return reject("Name is invalid");
      }
      const existingUser = this.users.find((user) => user.name === trimNmae);
      if (existingUser) {
        return reject("Username is already taken");
      }
      const user = { id, name: trimNmae, isJoined: false };
      this.users.push(user);
      return resolve(user);
    });
  };

  getUsers() {
    return this.users;
  }

  removeUser = (id) => {
    const index = this.users.findIndex((user) => user.id === id);
    //console.log(this.users[index]);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  };

  getUser = (id) => {
    return this.users.find((user) => user.id === id);
  };
}

module.exports = Users;
