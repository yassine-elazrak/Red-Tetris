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

  getRoom = (name) => {
    return new Promise((resolve, reject) => {
      let trimName = name.trim().toLowerCase();
      if (!this.regx.test(trimName)) {
        return reject({ message: "Name is invalid" });
      }
      let existingRoom = this.rooms.find((room) => room.name === trimName);
      if (existingRoom) {
        return resolve(existingRoom);
      }
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
        status: "waiting",
        users: [userId],
      };
      this.rooms.push(room);
      return resolve(room);
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

  closeRoom = (roomName, userId) => {
    return new Promise((resolve, reject) => {
      let trimName = roomName.trim().toLowerCase();
      if (!this.regx.test(trimName))
        return reject({ message: "Room name is invalid" });
      let indexRoom = this.rooms.findIndex((room) => room.name === trimName);
      if (indexRoom === -1) return reject({ message: "Room not found" });
      let user = this.rooms[indexRoom].users.find((user) => user === userId);
      if (!user) return reject({ message: "User is not joined" });
      this.rooms[indexRoom].status = "closed";
      return resolve(this.rooms[indexRoom]);
    });
  };

  leaveRoom = (userId, roomName) => {
    return new Promise((resolve, reject) => {
      let indexRoom = this.rooms.findIndex((room) => room.name === roomName);
      if (indexRoom === -1) return reject({ message: "Room not found" });
      let indexuser = this.rooms[indexRoom].users.findIndex(
        (user) => user === userId
      );
      if (indexuser === -1) return reject({ message: "User is not joined" });
      this.rooms[indexRoom].users.splice(indexuser, 1);
      if (this.rooms[indexRoom].users.length === 0)
          this.rooms.splice(indexRoom, 1);
      return resolve();
    });
  };

  deleteRoom = (id) => {
    return new Promise((resolve, reject) => {
      let existingRoom = this.rooms.find((room) => room.id === id);
      if (!existingRoom) return reject({ message: "Room not found" });
      let index = this.rooms.findIndex((room) => room.id === id);
      this.rooms.splice(index, 1);
      return resolve(this.rooms);
    });
  };
}

module.exports = Rooms;
