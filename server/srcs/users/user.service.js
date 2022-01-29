class UsersService{
    constructor(){
        this.users = [];
            
    }
    //add notification to user
    addUser(id, name, room){

        name = name.trim().toLowerCase();
        room = room.trim().toLowerCase();
        const existingUser = this.users.find((user) => user.room === room && user.name === name);
        if (existingUser)
            return {error: 'Username is taken'};
        const user = {id, name, room};
        this.users.push(user);
        return {user};

    }

    removeUser(id){
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1)
            {
                return this.users.splice(index, 1)[0];
            }
    }

    getUser(id){
        const user = this.users.find((user) => user.id === id);
        if (user)
            return user;
    }
    getUserInRoom(room){
        const users = this.users.filter((user) => user.room === room);
        return users;
    }

}


module.exports.UsersService = new UsersService()
