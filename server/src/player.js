
class Player{
    constructor(id, name, socket){
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.game = null;
        this.room = null;
    }
    joinRoom(room){
        this.room = room;
        this.socket.join(room);
    }
    leaveRoom(){
        this.socket.leave(this.room);
        this.room = null;
    }
    sendMessage(message){
        this.socket.emit("message", message);
    }
}