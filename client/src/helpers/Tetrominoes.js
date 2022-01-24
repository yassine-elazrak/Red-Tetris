
export const TETROMINOES = {
    0: {
        shape : [0],
        color: "208, 211, 212",
    },
    I: {
        shape : [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
        ],
        color: "80, 227, 230",
        min_max_x: [1, 1],
        min_max_y: [0, 3],
    },
    J: {
        shape : [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0],
        ],
        color: "36, 95, 223",
        min_max_x: [0, 1],
        min_max_y: [0, 2],
    },
    L: {
        shape : [
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L'],
        ],
        color: "223, 173, 36",
        min_max_x: [1, 2],
        min_max_y: [0, 2],
    },
    O: {
        shape : [
            ['O', 'O'],
            ['O', 'O'],
        ],
        color: "223, 217, 36",
        min_max_x: [0, 1],
        min_max_y: [0, 1],
    },
    S: {
        shape : [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0],
        ],
        color: "48, 211, 56",
        min_max_x: [0, 2],
        min_max_y: [0, 1],
    },
    T: {
        shape : [
            [0, 0, 0],
            ['T', 'T', 'T'],
            [0, 'T', 0],
        ],
        color: "132, 61, 198",
        min_max_x: [0, 2],
        min_max_y: [0, 1],
    },
    Z: {
        shape : [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
            [0, 0, 0],
        ],
        color: "227, 78, 78",
        min_max_x: [0, 2],
        min_max_y: [0, 1],
    },
    D: {
        shape : ['D'],
        color: "0, 0, 0",
    },
};

export const randomTetromino = () => {
    const tetrominoes = 'IJLOSTZ';
    const randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    return TETROMINOES[randomTetromino];
}