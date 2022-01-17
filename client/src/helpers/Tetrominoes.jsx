
const Tetrominoes = {
    I: {
        shape : [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],
        color: "cyan",
    },
    J: {
        shape : [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0],
        ],
        color: "blue",
    },
    L: {
        shape : [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ],
        color: "orange",
    },
    O: {
        shape : [
            [4, 4],
            [4, 4],
        ],
        color: "yellow",
    },
    S: {
        shape : [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ],
        color: "green",
    },
    T: {
        shape : [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0],
        ],
        color: "purple",
    },
    Z: {
        shape : [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ],
        color: "red",
    },
};


export default Tetrominoes;
