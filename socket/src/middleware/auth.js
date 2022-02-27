
class AuthMiddleware {

    auth = (socket) => (packet, next) => {
        if (typeof packet[2] !== 'function'){
            const err = new Error("Please use callback function like (evet, data, callback(res, err))")
            return next(err)
        }
        if (packet[0] !== "login" && !socket.rooms.has('online')){
            const err = new Error("You are not authorized");
            return next(err);
        }
        return next();
    }

}


module.exports = AuthMiddleware;