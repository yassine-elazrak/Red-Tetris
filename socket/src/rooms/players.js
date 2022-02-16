const STAGE_HEIGHT = require('../utils/stage').STAGE_HEIGHT;
const STAGE_WIDTH = require('../utils/stage').STAGE_WIDTH;
const TETROMINOES = require('../utils/tetrominoes').TETROMINOES;

class Players {
    constructor(player) {
        this.player = player;
        // this.Hi = Stage.STAGE_WIDTH;
        // full profile of player;
    }

    // reset Map
    resetMap = () => {
        this.player.map.forEach(y => y.forEach(x => [0, "clear"]));
    }

    // clear Map
    clearMap = () => {
        this.player.map.forEach(y => y.forEach(cell =>
            cell[1] === "clear" || cell[1] === "shadow" ? [0, "clear"] : cell
        ))
    }

    // update Map
    updateMap = () => {
        this.clearMap();
        let { position } = this.player.currentTetromino;
        let { collided } = this.player.currentTetromino;
        let shape = TETROMINOES[this.player.currentTetromino.shapeIndex];
        let { map } = this.player;
        shape.forEach((row, y) => {
            row.forEach((v, x) => {
                if (v !== 0) {
                    // shadow

                    if (y + position.y >= 0) {
                        map[y + position.y][x + position.x] = [v, !collided ? "clear" : "tetromino"]
                    }
                }
            })
        });
        // if (collided) // delet rows
        return map;
    }


    // checkCollision
    checkCollision = (dir) => {
        let position = this.player.position;
        let shape = TETROMINOES[this.player.currentTetromino.shapeIndex];
        let map = this.player.map;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    if (
                        x + dir.x + position.x < 0 ||
                        x + dir.x + position.x >= STAGE_WIDTH ||
                        y + dir.y + position.y >= STAGE_HEIGHT
                    ) return true;
                    if (y + dir.y + position.y >= 0) {
                        if (
                            map[y + dir.y + position.y] &&
                            map[y + dir.y + position.y][x + dir.x + position.x] &&
                            map[y + dir.y + position.y][x + dir.y + position.y][1] === "tetromino"
                        ) return true;
                    }
                }
            }
        }
        return false;
    }

    // move Tetromino
    moveTetromino = (dir) => {
        if (!this.checkCollision) {
            this.player.currentTetromino.position.x += dir.x;
            this.player.currentTetromino.position.y += dir.y;
            return true;
        }
        return false;
    }

    // rotate Tetromino

    // Drop Tetromino to down
    dropToDown = () => {
        let dir = { x: 0, y: 1 };
        while (this.moveTetromino(dir) === true);
        // update Map
    }

    // add Well

    // get action
    action = (a) => {
        return new Promise((resolve, reject) => {
            if (!['down', 'right', 'left', 'rotate', 'drop'].includes(a))
                return reject({ message: "Invalid action" });
            if (a === 'drop')
                this.dropToDown();
            else if (a === 'right')
                this.moveTetromino({ x: 1, y: 0 });
            else if (a === 'left')
                this.moveTetromino({ x: -1, y: 0 });
            else if (a === 'down')
                this.moveTetromino({ x: 0, y: 1 });
            // rotate
            this.updateMap();
            resolve(this.player.map);
        })
    }
}


module.exports = Players;