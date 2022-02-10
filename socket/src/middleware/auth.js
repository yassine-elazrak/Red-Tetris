
class AuthMiddleware {

    auth = (socket) => (packet, next) => {


        // console.log("auth", packet);

        console.log(packet[0] !== "login", !socket.rooms.has('online'))
        if (packet[0] !== "login" && !socket.rooms.has('online')){
            const err = new Error("You are not authorized");
            return next(err);
        }
        return next();
    }

}


module.exports = AuthMiddleware;


