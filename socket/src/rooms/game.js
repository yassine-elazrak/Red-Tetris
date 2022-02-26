const { STAGE_HEIGHT, STAGE_WIDTH } = require('../utils/stage');

class Players {

    // reset Map
    resetGame = (player, nextTetromino) => {
        player.map = player.map.map(row => row.map(_ => [0, "clear"]));
        player.status = "continue";
        player.scor = 0;
        player.rows = 0;
        player.nextTetrominos = [nextTetromino];
        player.currentTetromino = {
            position: { x: 0, y: 0 },
            shape: 0,
            shadow: { x: 0, y: 0 },
            collided: false,
        }
    }

    // clear Map
    clearMap = (player) => {
        player.map = player.map.map(y => y.map(cell =>
            cell[1] === "clear" || cell[1] === "shadow" ? [0, "clear"] : cell
        ))
    }

    // update Map
    updateMap = (player, shadow) => {
        this.clearMap(player);
        let { position, collided, shape } = player.currentTetromino;
        let { map } = player;
        shape.forEach((row, y) => {
            row.forEach((v, x) => {
                if (v !== 0) {
                    if (y + position.y + shadow > 0) {
                        map[y + position.y + shadow][x + position.x] = [v, 'shadow']
                    }
                    if (y + position.y >= 0) {
                        map[y + position.y][x + position.x] = [v, !collided ? "clear" : "tetromino"]
                    }
                }
            })
        });
        return map;
    }


    // checkCollision
    checkCollision = (dir, map, position, shape) => {
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
                            (
                                map[y + dir.y + position.y][x + dir.x + position.x][1] === "tetromino" ||
                                map[y + dir.y + position.y][x + dir.x + position.x][1] === 'wall'
                            )
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
            player.currentTetromino.position.x += dir.x;
            player.currentTetromino.position.y += dir.y;
            return true;
        }
        return false;
    }

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
        let rotate = shape.map((row, y) =>
            row.map((_, x) => shape[len - x][y])
        )
        if (!this.checkCollision({ x: 0, y: 0 }, player.map, newPositon, rotate)) {
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
        return y ? y - 1 : y;
    }

    // add Wall
    addWall = (playerId, players, walls) => {
        players.forEach(player => {
            if (player.id !== playerId) {
                player.currentTetromino.position.y -= walls;
                let newWalls = Array.from(Array(walls), () =>
                    new Array(STAGE_WIDTH).fill(['W', 'wall'])
                )
                player.map.push(...newWalls);
                player.map = player.map.slice(walls);
            }
        });
    }

    // delet row
    deletRow = (player, players) => {
        let rows = 0;
        let bonus = 0;
        let newMap = []
        player.map.forEach(e => {
            if (!e.find(cell => cell[0] === 'W') && (e.findIndex(cell => cell[0] === 0) === -1)) {
                newMap.unshift(new Array(STAGE_WIDTH).fill([0, 'clear']));
                rows++;
            } else {
                newMap.push(e);
            }
        })
        player.map = newMap;


        if (rows) {
            this.addWall(player.id, players, rows);
            bonus = Math.round((rows / 100) * 4 * 10) * 10;
            player.rows += rows;
            player.scor += rows * 10 + bonus;
        }
    }

    // getWinner
    getWinner = (room) => {
        let winners = [], indexs = [];
        room.users.forEach((u, i) => {
            if (!u.status) {
                winners.push(u);
                indexs.push(i);
            }
        })
        if (winners.length === 1) {
            room.users[indexs[0]].status = 'gameWinner';
            room.status = 'end'
        }
        else if (room.users.length === 1) room.status = 'end'
    }

    // get action
    action = (a, player, room) => {
        return new Promise((resolve, reject) => {
            if (!['dropDown', 'right', 'left', 'rotate', 'down'].includes(a))
                return reject({ message: "Invalid action" });
            if (a === 'dropDown') {
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
                this.deletRow(player, room.users);
            }
            if (player.currentTetromino.position.y <= 0 && player.currentTetromino.collided) {
                player.status = 'gameOver';
                this.getWinner(room);
            }
            resolve(player);
        })
    }
}


module.exports = Players;