const game = require("./game");
const Users = require("./users");

class Queue {
  constructor() {
    this.items = [];
  }
  push(item) {
    this.items.push(item);
  }
  pop() {
    return this.items.shift();
  }
  isEmpty() {
    if (this.items.length === 0) {
      return true;
    }
    return false;
  }
}

class Player {
  constructor() {
    this.queue = new Queue();
    this.board = game.createBoard(20, 10);
    this.score = 0;

  }

}

module.exports = Player;
