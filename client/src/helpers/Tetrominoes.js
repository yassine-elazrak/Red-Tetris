
export const TETROMINOES = {
    0: {
        shape : [0],
        color: "0, 0, 0",
    },
    I: {
        shape : [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
        color: "80, 227, 230",
    },
    J: {
        shape : [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0],
        ],
        color: "36, 95, 223",
    },
    L: {
        shape : [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ],
        color: "223, 173, 36",
    },
    O: {
        shape : [
            [4, 4],
            [4, 4],
        ],
        color: "223, 217, 36",
    },
    S: {
        shape : [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ],
        color: "48, 211, 56",
    },
    T: {
        shape : [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0],
        ],
        color: "132, 61, 198",
    },
    Z: {
        shape : [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ],
        color: "227, 78, 78",
    },
};

export const randomTetromino = () => {
    const tetrominoes = 'IJLOSTZ';
    const randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    return TETROMINOES[randomTetromino];
}