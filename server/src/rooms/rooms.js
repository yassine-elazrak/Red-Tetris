class Rooms {
  constructor() {
    if (Rooms.instance instanceof Rooms) {
      return Rooms.instance;
    }
    this.rooms = [];
    this.regx = /^[a-zA-Z0-9\s]{3,15}$/;

    Rooms.instance = this;
  }

  getRoom = (id) => {
    return this.rooms.find((room) => room.id === id);
  };

  createRoom = async (id, name) => {
    return new Promise((resolve, reject) => {
      const trimNmae = name.trim().toLowerCase();
      if (!this.regx.test(trimNmae)) reject("Name is invalid");
      if (this.getRoom(trimNmae)) reject("Room name is already taken");
      const room = { id, name: trimNmae };
      this.rooms.push(room);
      return resolve(room);
    });
  };
}

module.exports = Rooms;
