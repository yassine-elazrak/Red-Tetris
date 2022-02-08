class AuthMiddleware {

    constructor (io) {
        if (AuthMiddleware.instance instanceof AuthMiddleware)
            return AuthMiddleware.instance;
        this.io = io;
        this.instance = this;
    }

    auth = (socket) => async (packet, next) => {


        console.log(packet);
        if (socket[0] === "login")
            return next();
        
        let users = await this.io.sockets.adapter.rooms.get('online');
        // let users = await socket.rooms['online'];
        // let keys = users.incldue(socket.id);
        let isJoned = await this.io.sockets.adapter;
        console.log(isJoned, "users");
        // console.log(keys, "keys");
        // let finduser = users?.map( (user) => {
        //     console.log(user);
        //     return user.id;
        //     });
        // let index = users.findIndex((user) => user.id === socket.id);

        // if (index === -1)
        //     return next(new Error("You are not logged in"));

        return next();
        
        console.log(packet[0], 'event');
        console.log(socket.id, "socketId");
        // console.log(socket);
        
        return next();
        // try {
        // let online = await this.io.sockets.adapter.rooms.get('online');
        // console.log(online, "online");
        // next();

        // try {
        //     let res = await this.io.sockets.adapter.rooms.get('online');

        // } catch (error) {
        //     next(error);
        // }

    }

}


module.exports = AuthMiddleware;


