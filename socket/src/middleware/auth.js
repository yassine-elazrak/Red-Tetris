
class AuthMiddleware {

    auth = (socket) => (packet, next) => {
        if (packet[0] !== "login" && !socket.rooms.has('online')){
            const err = new Error("You are not authorized");
            return next(err);
        }
        return next();
    }

}


module.exports = AuthMiddleware;


