// const { TETROMINOES } = require('../../../client/src/helpers/Tetrominoes');
const StageHelper = require('../utils/stage')
const { TetrominoesClass, TETROMINOES } = require('../utils/tetrominoes')
class Rooms {
  constructor() {
    if (Rooms.instance instanceof Rooms) {
      return Rooms.instance;
    }
    this.rooms = [
      /**
       * @content
       * @param {string} id - room id
       * @param {string} name - room name
       * @param {boolean} isPrivate - is room private
       * @param {string} status - room status
       * @param {string} admin - room admin
       * @param {array} users - room users
       * @param {array} invit - room invit
       */
    ];
    this.regx = /^[a-zA-Z0-9\s]{3,15}$/;
    Rooms.instance = this;
    this.stage = new StageHelper.Stage;
    this.tetromino = new TetrominoesClass;
  }

  getRooms = () => {
    let rooms = this.rooms.filter((room) => room.isPravite === false);
    return rooms;
  };

  getRoomUsers = (id) => {
    return new Promise((resolve, reject) => {
      const room = this.rooms.find((room) => room.id === id);
      if (room) {
        let users = room.users.map((user) => {
          return (
            (({ id }) => ({ id }))(user)
          )
        });
        return resolve(users);
      }
      return reject({ message: "Room not found" });
    });
  };

  getRoom = (id) => {
    return new Promise((resolve, reject) => {
      let index = this.rooms.findIndex((room) => room.id === id);
      if (index !== -1)
        return resolve(this.rooms[index]);
      return reject({ message: "Room not found" });
    });
  };

  newUser = (id, name, nextTetrominos) => {
    let user = {
      id,
      name,
      status: null, // winer, loser, continue 
      scor: 0,
      rows: 0,
      map: this.stage.initStage(),
      nextTetrominos: [nextTetrominos],
      currentTetromino: {
        position: { x: 0, y: 0 },
        shape: 0,
        shadow: { x: 0, y: 0 },
        collided: false,
      }
    }
    return user;
  }

  createRoom = (data, user) => {
    return new Promise((resolve, reject) => {
      let trimName = data.roomName.trim().toLowerCase();
      if (!this.regx.test(trimName)) {
        return reject({ message: "Room name is invalid" });
      }
      let existingRoom = this.rooms.find((room) => room.name === trimName);
      if (existingRoom) {
        if (existingRoom.status !== 'waiting')
          return reject({
            message: "Room is already exists and closed",
          });

        return reject({
          message: "Room is already exists do you want to join",
        });
      }
      let nextTetromino = this.tetromino.randomTetromino();
      let room = {
        id: Math.random().toString(36).substr(2) + Date.now().toString(36),
        name: trimName,
        admin: user.id,
        isPravite: data.isPravite,
        status: data.isPravite ? "closed" : "waiting",
        nextTetromino,
        ids: [user.id],
        users: [this.newUser(user.id, user.name, nextTetromino)],
        invit: [],
      };
      this.rooms.push(room);
      return resolve(room);
    });
  };

  NextTetromino = (roomIndex) => {
    let nextTetromino = this.tetromino.randomTetromino();
    this.rooms[roomIndex].nextTetrominos = nextTetromino;
    this.rooms[roomIndex].users.forEach(u => {
      u.nextTetrominos.push(nextTetromino);
    })
  }

  changeCurrentTetromino = (userIndex, roomIndex) => {
    let shape = TETROMINOES[this.rooms[roomIndex].users[userIndex].nextTetrominos[0]];
    let currentTetromino = {
      position: {
        x: Math.ceil(StageHelper.STAGE_WIDTH / 2 - shape.length / 2),
        y: (-1 * shape.length) + 1,
      },
      shape,
      collided: false,
    }
    this.rooms[roomIndex].users[userIndex].currentTetromino = currentTetromino;
    console.log('user next Tetrominos', this.rooms[roomIndex].users[userIndex].nextTetrominos);
    this.rooms[roomIndex].users[userIndex].nextTetrominos.shift();
    if (!this.rooms[roomIndex].users[userIndex].nextTetrominos.length){
      let nextTetromino = this.tetromino.randomTetromino();
      this.rooms[roomIndex].users.forEach(u => {
        u.nextTetrominos.push(nextTetromino);
      })
    }
    return this.rooms[roomIndex];
  }

  inviteUser = (data) => {
    return new Promise((resolve, reject) => {
      let index = this.rooms.findIndex((room) => room.id === data.roomId);
      if (index !== -1) {
        let newUser = {
          userId: data.userId,
          userName: data.userName,
          status: 'waiting',
        }
        this.rooms[index].invit.push(newUser);
        return resolve(this.rooms[index]);
      }
      return reject({ message: "Room not found" });
    });
  };


  changeStatusInvitation = (data) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === data.roomId);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      let invitIndex = this.rooms[roomIndex].invit.findIndex(item => item.userId === data.userId);
      if (invitIndex === -1) return reject({ message: "Your are not invited in this room" });
      this.rooms[roomIndex].invit[invitIndex].status = data.status;
      if (data.status === "accepted") {
        let name = this.rooms[roomIndex].invit[invitIndex].userName;
        let nextTetromino = this.rooms[roomIndex].nextTetromino;
        let user = this.newUser(data.userId, name, nextTetromino);
        this.rooms[roomIndex].users.push(user);
        this.rooms[roomIndex].ids.push(data.userId);
      }
      resolve(this.rooms[roomIndex]);
    })
  }

  joinRoom = (data) => {
    return new Promise((resolve, reject) => {
      let Index = this.rooms.findIndex((room) => room.id === data.roomId);
      if (Index === -1) return reject({ message: "Room not found" });
      if (this.rooms[Index].status !== "waiting" && this.rooms[Index].status !== 'end')
        return reject({ message: "Room is closed" });
      if (this.rooms[Index].users.findIndex((user) => user.id === data.userId) !== -1)
        return reject({ message: "You are already in a room" });
      let user = this.newUser(data.userId, data.userName, this.rooms[Index].nextTetromino);
      let isInveted = this.rooms[Index].invit.findIndex(user => user.userId === data.userId);
      if (isInveted !== -1)
        this.rooms[Index].invit[isInveted].status = "accepted";
      this.rooms[Index].users.push(user);
      this.rooms[Index].ids.push(data.userId);
      return resolve(this.rooms[Index]);
    });
  };

  // start puase or close room
  changeStatusRoom = (data, room) => {
    console.log('room new status', data.status);
    return new Promise((resolve, reject) => {
      if (room.admin !== data.userId)
        return reject({ message: "You are not admin" });
      if (room.status === 'end') this.restRoom(room);
      if (data.status === 'closed'){
        room.nextTetromino = this.tetromino.randomTetromino();
      }
      room.status = data.status;
      return resolve(true);
    });
  };

  leaveRoom = (userId, roomId) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === roomId);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      let userIndex = this.rooms[roomIndex].users.findIndex((user) => user.id === userId);
      if (userIndex === -1) return reject({ message: "User is not joined" });
      this.rooms[roomIndex].users.splice(userIndex, 1);
      this.rooms[roomIndex].ids = this.rooms[roomIndex].ids.filter((id) => id !== userId);
      return resolve(this.rooms[roomIndex]);
    });
  };

  switchAdmin = (roomId) => {
    let roomIndex = this.rooms.findIndex((room) => room.id === roomId);
    this.rooms[roomIndex].admin = this.rooms[roomIndex].users[0].id;
    return this.rooms[roomIndex];
  }

  restRoom = (room) => {
    console.log('restRoom =>', room);
    room.users = room.users.filter(u => !u.status || u.status === 'continue');
    room.users.forEach((_, i) => room.users[i].status = false);
    console.log('room users =>', room.users);
    room.nextTetromino = this.tetromino.randomTetromino();
    room.users.forEach(u => u.nextTetrominos = [room.nextTetromino]);
  }

  deleteRoom = (id) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === id);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      this.rooms.splice(roomIndex, 1);
      return resolve(this.getRooms());
    });
  };
}

module.exports = Rooms;
