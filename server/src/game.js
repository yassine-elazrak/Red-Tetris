const 

class Piece {
  constructor(id, x, y, color, shape) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.shape = shape;
    //x, y, cordonnees piece in board piece start from 0 , 0
  }
}

// const generatePiece = (max, min) => {
//   return Math.floor(Math.random() * (max - min) + min);
// };

class Game {
  constructor() {
    this.pieces = [];
    this.currentPiece = null;
    this.Board = this.createBoard(20, 10);
  }
  pushPiece(piece) {
    this.pieces.push(piece);
  }
  getPiece() {
    this.currentPiece = this.pieces.shift();
  }
  createBoard(lengthRows, lengthCols) {
    return Array.from({ length: lengthRows }, () =>
      Array.from({ length: lengthCols }, () => 0)
    );
  }
  movePiece(direction) {
    if (direction === "left" && this.isCanMove("left")) {
      this.currentPiece.x--;
    } else if (direction === "right" && this.isCanMove("right")) {
      this.currentPiece.x++;
    } else if (direction === "down" && this.isCanMove("down")) {
      this.currentPiece.y++;
    }
  }

  isCanMove(direction) {
    if (direction === "left") {
      return this.currentPiece.x - 1 >= 0 && this.checkCollision();
    } else if (direction === "right") {
      return (
        this.currentPiece.x + 1 < this.Board[0].length && this.checkCollision()
      );
    } else if (direction === "down") {
      return (
        this.currentPiece.y + 1 < this.Board.length && this.checkCollision()
      );
    }
  }

  drawPiece() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.Board[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.id;
        }
      });
    });
  }

  checkCollision() {
    this.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (
          value !== 0 &&
          this.Board[this.currentPiece.y + y][this.currentPiece.x + x] !== 0
        ) {
          return false;
        }
      });
    });
    return true;
  }
}

game = new Game();

console.log(game.Board);
module.exports = game;
export 
