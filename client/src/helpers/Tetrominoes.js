
export const TETROMINOES = {
    0: {
        shape: [0],
        color: "208, 211, 212",
        // type: 0,
    },
    I: {
        shape: [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
        ],
        // type: "I",
        color: "80, 227, 230",
    },
    J: {
        shape: [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0],
        ],
        // type: "J",
        color: "36, 95, 223",
    },
    L: {
        shape: [
            ['L', 0, 0],
            ['L', 0, 0],
            ['L', 'L', 0],
        ],
        // type: "L",
        color: "223, 173, 36",
    },
    O: {
        shape: [
            ['O', 'O'],
            ['O', 'O'],
        ],
        // type: "O",
        color: "223, 217, 36",
    },
    S: {
        shape: [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0],
        ],
        // type: "S",
        color: "48, 211, 56",
    },
    T: {
        shape: [
            ['T', 'T', 'T'],
            [0, 'T', 0],
            [0, 0, 0],
        ],
        // type: "T",
        color: "132, 61, 198",
    },
    Z: {
        shape: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
            [0, 0, 0],
        ],
        // type: "Z",
        color: "227, 78, 78",
    },
    D: {
        shape: ['D'],
        // type: "D",
        color: "0, 0, 0",
    },
};

export const randomTetromino = () => {
    const tetrominoes = 'IJLOSTZ';
    const randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    return randomTetromino;
}