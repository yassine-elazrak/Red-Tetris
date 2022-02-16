const STAGE_HEIGHT = require('../utils/stage').STAGE_HEIGHT;
const STAGE_WIDTH = require('../utils/stage').STAGE_WIDTH;
const { TETROMINOES } = require('../utils/tetrominoes');

class Players {
    // constructor(player) {
    //     this.player = player;
    //     // this.Hi = Stage.STAGE_WIDTH;
    //     // full profile of player;
    // }

    // reset Map
    resetMap = (player) => {
        player.map.forEach(y => y.forEach(x => [0, "clear"]));
    }

    // clear Map
    clearMap = (player) => {
        // console.log(player);
        player.map = player.map.map(y => y.map(cell =>
            cell[1] === "clear" || cell[1] === "shadow" ? [0, "clear"] : cell
        ))
        // console.log(player.map);
    }

    // update Map
    updateMap = (player) => {
        this.clearMap(player);
        let { position } = player.currentTetromino;
        let { collided } = player.currentTetromino;
        let shape = TETROMINOES[player.currentTetromino.shapeIndex];
        // console.log(shape);
        let { map } = player;
        shape.forEach((row, y) => {
            row.forEach((v, x) => {
                if (v !== 0) {
                    // shadow

                    if (y + position.y >= 0) {
                        // console.log('value', y + position.y, x + position.x );
                        map[y + position.y][x + position.x] = [v, !collided ? "clear" : "tetromino"]
                    }
                }
            })
        });
        // if (collided) // delet rows
        return map;
    }


    // checkCollision
    checkCollision = (dir, player) => {
        let { position } = player.currentTetromino;
        console.log("position", position);
        let shape = TETROMINOES[player.currentTetromino.shapeIndex];
        let map = player.map;
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
                            map[y + dir.y + position.y][x + dir.x + position.x][1] === "tetromino"
                        ) return true;
                    }
                }
            }
        }
        return false;
    }

    // move Tetromino
    moveTetromino = (dir, player) => {
        // let { position } = player.currentTetromino;
        // console.log(player, 'position');
        if (!this.checkCollision(dir, player)) {
            console.log("playerPosition", player.currentTetromino.position);
            player.currentTetromino.position.x += dir.x;
            player.currentTetromino.position.y += dir.y;
            return true;
        }
        return false;
    }

    // moveToDown = (palyer) => {
    //     let dir = { x: 0, y: 1 };
    //     if ()
    // }

    // rotate Tetromino

    // Drop Tetromino to down
    dropToDown = (player) => {
        let y = 0;
        while (this.moveTetromino({ x: 0, y }, player) === true)
            y++;
        return y;
    }

    // add Well

    // get action
    action = (a, player) => {
        return new Promise((resolve, reject) => {
            if (!['down', 'right', 'left', 'rotate', 'drop'].includes(a))
                return reject({ message: "Invalid action" });
            if (a === 'drop')
                this.dropToDown(player);
            else if (a === 'right')
                this.moveTetromino({ x: 1, y: 0 }, player);
            else if (a === 'left')
                this.moveTetromino({ x: -1, y: 0 }, player);
            else if (a === 'down'){
                if (!this.moveTetromino({ x: 0, y: 1 }, player))
                player.currentTetromino.collided = true;
            }
            // rotate
            this.updateMap(player);
            resolve(player);
        })
    }
}


module.exports = Players;