class AuthMiddleware {

    constructor(io) {
        if (AuthMiddleware.instance instanceof AuthMiddleware)
            return AuthMiddleware.instance;
        this.io = io;
        this.instance = this;
    }

    auth = (socket) => async (packet, next) => {


        console.log("auth", packet[0]);

        console.log(packet[0] !== "login", !socket.rooms.has('online'))
        if (packet[0] !== "login" && !socket.rooms.has('online')){
            let err = new Error("You are not authorized");
            err.code = 401;
            return next(err);
        }
        return next();
    }

}


module.exports = AuthMiddleware;


