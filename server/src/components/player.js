

class Player{

    constructor(){
        this.board = null
        this.score = 0
        
    }
    login(socket){
        console.log(`User connected: ${socket.id}`);
    }
    logout(socket){
        console.log(`User logout: ${socket.id}`);
    }
    joinRoom(socket){
        console.log(`User join: ${socket.id}`);
    }


}