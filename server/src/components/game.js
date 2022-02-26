
class Game {
  constructor() {
    if (Game.instance instanceof Game) {
      return Game.instance;
    }
    Game.instance = this;
  }

  createBoard(rows, cols) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    );
  }
  clearBoard(Board) {
    return Board.forEach((row, y) => {
      row.forEach((_, x) => {
        Board[y][x] = 0;
      });
    });
  }

  startGame() {}
  endGame() {}
  stopGame() {}
  updateBoard() {}
  checkCollision() {}
  movePiece() {}
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
          this.Board[this.currentPiece.y + y][this.currentPiece.x + x] =
            this.currentPiece.id;
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


module.exports = new Game();
