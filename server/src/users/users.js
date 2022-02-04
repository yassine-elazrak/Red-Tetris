
class Users {
    constructor() {
        if (Users.instance instanceof Users) {
            return Users.instance;
        }
        this.users = [];

        Users.instance = this;
    }

    addNewUser = (id, name) => {
        return new Promise((resolve, reject) => {
            const trimNmae = name.trim().toLowerCase();
            const existingUser = this.users.find((user) => user.name === trimNmae);
            if (existingUser) {
                return reject({ message: 'Username is taken' });
            }
            const user = { id, name: trimNmae, isJoned: false };
            this.users.push(user);
            return resolve(user);
        });
    }


    getUsers() {
        return this.users;
    }

    removeUser = (id) => {
        const index = this.users.findIndex((user) => user.id === id);
        console.log(this.users[index]);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }
}


module.exports = Users;
