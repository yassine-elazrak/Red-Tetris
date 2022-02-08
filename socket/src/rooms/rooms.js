class Rooms {
  constructor() {
    if (Rooms.instance instanceof Rooms) {
      return Rooms.instance;
    }
    this.rooms = [];
    this.regx = /^[a-zA-Z0-9\s]{3,15}$/;
    Rooms.instance = this;
  }

  getRooms = () => {
    return this.rooms;
  };

  getRoomUsers = (id) => {
    return new Promise((resolve, reject) => {
      const room = this.rooms.find((room) => room.id === id);
      if (room) {
        return resolve(room.users);
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

  createRoom = (data, userId) => {
    return new Promise((resolve, reject) => {
      let trimName = data.roomName.trim().toLowerCase();
      if (!this.regx.test(trimName)) {
        return reject({ message: "Room name is invalid" });
      }
      let existingRoom = this.rooms.find((room) => room.name === trimName);
      if (existingRoom) {
        return reject({
          message: "Room is already exists do you want to join",
        });
      }
      let room = {
        name: trimName,
        isPravite: data.isPravite,
        admin: userId,
        id: userId,
        status: "waiting",
        users: [userId],
        invit: [],
      };
      this.rooms.push(room);
      return resolve(room);
    });
  };

  inviteUser = (data) => {
    return new Promise((resolve, reject) => {
      let index = this.rooms.findIndex((room) => room.id === data.roomId);
      if (index !== -1) {
        let room = {
          ...this.rooms[index],
          invit: [...this.rooms[index].invit,
          {
            userId: data.userId,
            userName: data.userName,
            status: 'wating',
            // read: false,
          }]
        };
        this.rooms[index] = room;
        return resolve(room);
      }
      return reject({ message: "Room not found" });
    });
  };

  joinRoom = (data) => {
    return new Promise((resolve, reject) => {
      let trimName = data.name.trim().toLowerCase();
      if (!this.regx.test(trimName))
        return reject({ message: "Room name is invalid" });
      let existingRoom = this.rooms.find((room) => room.name === trimName);
      if (!existingRoom) return reject({ message: "Room not found" });
      let user = existingRoom.users.find((user) => user === data.userId);
      if (user) return reject({ message: "User is already joined" });
      existingRoom.users.push(data.userId);
      return resolve(existingRoom);
    });
  };

  closeRoom = (roomId, userId) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === roomId);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      if (this.rooms[roomIndex].admin !== userId)
        return reject({ message: "You are not admin" });
      this.rooms[roomIndex].status = "closed";
      return resolve(this.rooms[roomIndex]);
    });
  };

  leaveRoom = (userId, roomId) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === roomId);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      console.log(this.rooms[roomIndex], userId);
      let userIndex = this.rooms[roomIndex].users.findIndex((user) => user === userId);
      if (userIndex === -1) return reject({ message: "User is not joined" });
      this.rooms[roomIndex].users.splice(userIndex, 1);
      return resolve(this.rooms[roomIndex]);
    });
  };

  deleteRoom = (id) => {
    return new Promise((resolve, reject) => {
      let roomIndex = this.rooms.findIndex((room) => room.id === id);
      if (roomIndex === -1) return reject({ message: "Room not found" });
      this.rooms.splice(roomIndex, 1);
      return resolve(this.rooms);
    });
  };
}

module.exports = Rooms;
