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
    updateMap = (player, shadow) => {
        this.clearMap(player);
        let { position, collided, shape } = player.currentTetromino;
        let { map } = player;
        shape.forEach((row, y) => {
            row.forEach((v, x) => {
                if (v !== 0) {
                    // console.log('psh', y + position.y + shadow);
                    if (y + position.y + shadow > 0){
                        map[y + position.y + shadow][x + position.x] = [v, 'shadow']
                    }
                    if (y + position.y >= 0) {
                        map[y + position.y][x + position.x] = [v, !collided ? "clear" : "tetromino"];
                    }
                }
            })
        });
        // if (collided) // delet rows
        return map;
    }


    // checkCollision
    checkCollision = (dir, map, position, shape) => {
        // let { position } = player.currentTetromino;
        console.log("position", position);
        // let map = player.map;
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
        let { shape, position } = player.currentTetromino;
        if (!this.checkCollision(dir, player.map, position, shape)) {
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
    rotateTetromino = (player) => {
        let { shape, position } = player.currentTetromino;
        let len = shape.length - 1;
        let newPositon = {
            x: position.x < 0
                ? 0
                : position.x + len >= STAGE_WIDTH - 1
                    ? STAGE_WIDTH - 1 - len
                    : position.x,
            y: position.y,
        }
        // console.log(shape, 'shape');
        let rotate = shape.map((row, y) =>
            // console.log(row)
            row.map((_, x) => shape[len - x][y])
        )
        if (!this.checkCollision({x: 0, y: 0}, player.map, newPositon, rotate)) {
            player.currentTetromino.position = newPositon;
            player.currentTetromino.shape = rotate;
        }
    }

    // Drop Tetromino to down
    dropToDown = (player) => {
        let y = 0;
        let { shape, position } = player.currentTetromino;
        while (!this.checkCollision({ x: 0, y }, player.map, position, shape))
            y++;
        console.log(y, 'shadow');
        return y ? y - 1 : y;
    }

    // add Well

    // delet row
    deletRow = (player) => {
        let rows = 0;
        // let scor = 0;
        let bonus = 0;
        player.map = player.map.reduce((ack, row) => {
            if (row.findIndex(cell => cell[0] === 0) === -1) {
                rows++;
                ack.unshift(new Array(STAGE_WIDTH).fill([0, 'clear']))
                return ack;
            }
            ack.push(row)
            return ack;
        }, []);
        if (rows) {
            bonus = Math.round((rows / 100) * 4 * 10) * 10;
            player.rows += rows;
            player.scor += rows * 10 + bonus;

        }
    }

    // get action
    action = (a, player, room) => {
        return new Promise((resolve, reject) => {
            if (!['downDown', 'right', 'left', 'rotate', 'down'].includes(a))
                return reject({ message: "Invalid action" });
            if (a === 'downDown'){
                let y = this.dropToDown(player);
                player.currentTetromino.position.y += y;
            }
            else if (a === 'right')
                this.moveTetromino({ x: 1, y: 0 }, player);
            else if (a === 'left')
                this.moveTetromino({ x: -1, y: 0 }, player);
            else if (a === 'down') {
                if (!this.moveTetromino({ x: 0, y: 1 }, player))
                    player.currentTetromino.collided = true;
            }
            else if (a === 'rotate') {
                this.rotateTetromino(player);
            }
            let shadow = this.dropToDown(player);
            this.updateMap(player, shadow);
            if (player.currentTetromino.collided) {
                this.deletRow(player)
            }
            if (player.currentTetromino.position.y <= 0 && player.currentTetromino.collided)
                player.status = 'gameOver'
            resolve(player);
        })
    }
}


module.exports = Players;