const TETROMINOES = {
    0: [0],
    I:  [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
        ],
    J: [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0],
        ],
    L:  [
            ['L', 0, 0],
            ['L', 0, 0],
            ['L', 'L', 0],
        ],
    O:  [
            ['O', 'O'],
            ['O', 'O'],
        ],
    S:  [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0],
        ],
    T:  [
            ['T', 'T', 'T'],
            [0, 'T', 0],
            [0, 0, 0],
        ],
    Z:  [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
            [0, 0, 0],
        ],
}

class TetrominoesClass {
    randomTetromino = () => {
        const indexs = 'IJLOSTZ';
        const random = indexs[Math.floor(Math.random() * indexs.length)];
        return random
    }
}

module.exports = {
    TetrominoesClass,
    TETROMINOES,
} 