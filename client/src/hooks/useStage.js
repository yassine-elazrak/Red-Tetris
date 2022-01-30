import Password from "antd/lib/input/Password";
import { useEffect, useState } from "react";
import {
    STAGE_HEIGHT,
    STAGE_WIDTH,
    InitStage,
} from "../helpers/StageHelper";
import { TETROMINOES, randomTetromino } from "../helpers/Tetrominoes";
import { useInterval } from "./useInterval";

export const useStage = () => {
    // console.log("useStage");
    // useEffect(() => {
    const [currentStage, setCurrentStage] = useState(InitStage());
    const [dropRow, setDropRow] = useState(0);
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [gamePause, setGamePause] = useState(false);
    const [currentTetromino, setCurrentTetromino] = useState({
        position: { x: 0, y: 0 },
        tetromino: [],
        collided: false,
    });
    const [nextTetromino, setNextTetromino] = useState(randomTetromino());
    const [delay, setDelay] = useState(null);

    const startGame = () => {
        setGameStart(true);
        setCurrentTetromino({
            pos: {
                x: Math.ceil((STAGE_WIDTH / 2) -
                    (TETROMINOES[nextTetromino].shape.length / 2)),
                y: 0,
            },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
    };
    // const updateCurrentTetromino
    const pauseGame = () => { setGamePause(!gamePause); };
    const updateStage = (newStage) => { setCurrentStage([...newStage]) };
    const updateScore = (score) => { setScore(score); };
    const updateRows = (rows) => { setRows(rows); };
    const updateGameOver = (gameOver) => { setGameOver(gameOver); };
    const updateGameWon = (gameWon) => { setGameWon(gameWon); };
    const updateCurrentTetromino = (tetromino) => {
        setCurrentTetromino(tetromino);
    };
    const swapTetrominos = () => {
        setCurrentTetromino({
            pos: {
                x: Math.ceil((STAGE_WIDTH / 2) -
                    (TETROMINOES[nextTetromino].shape.length / 2)),
                y: 0,
            },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
        setNextTetromino(randomTetromino);
    }
    const updateDropRow = (dropRow) => { setDropRow(dropRow); };

    const clearStage = () => {
        setCurrentStage(stage => {
            return stage.map(row => row.map((_, i) => 0));
        });
    };

    const resetGame = (NTetro) => {
        setGameStart(false);
        setGameOver(false);
        setGameWon(false);
        setGamePause(false);
        setScore(0);
        setRows(0);
        clearStage();
        // setCurrentStage(InitStage());
        setCurrentTetromino({
            pos: { x: 0, y: 0 },
            shape: [],
            collided: false,
        });
        setNextTetromino(NTetro);
        setDropRow(0);
    };

    const checkCollision = (tetromino, stage, offset) => {
        const { pos, shape } = tetromino;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0 && y + pos.y + offset.y > 0) {
                    if (y + offset.y + pos.y < 0 || y + offset.y + pos.y >= STAGE_HEIGHT
                        || x + offset.x + pos.x >= STAGE_WIDTH || x + offset.x + pos.x < 0) {
                        // console.log('true1', );
                        return true;
                    }
                    if (
                        stage[y + offset.y + pos.y] &&
                        stage[y + offset.y + pos.y][x + offset.x + pos.x] &&
                        stage[y + offset.y + pos.y][x + offset.x + pos.x] !== 0
                    ) {
                        // console.log('true');
                        return true;
                    }
                }
            }
        }
        // console.log('flase');
        return false;
    };


    const deletTetromino = (stage, tetromino) => {
        const newStag = stage.map(row => [...row]);
        tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0 && tetromino.pos.y + y >= 0) {
                    newStag[y + tetromino.pos.y][x + tetromino.pos.x] = 0;
                }
            });
        });
        return newStag;
    }

    const drawTetromino = () => {
        const newStag = currentStage.map(row => [...row])
        currentTetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0 && currentTetromino.pos.y + y >= 0) {
                    newStag[y + currentTetromino.pos.y][x + currentTetromino.pos.x] = value;
                }
            });
        });
        updateStage(newStag);
        return newStag;
    };


    // rotate the tetromino
    const rotateTetromino = (stage, tetromino) => {
        let newStage = deletTetromino(stage, tetromino);
        let len = tetromino.shape.length;
        const rotated = tetromino.shape.map((row, i) =>
            row.map((_, j) => tetromino.shape[len - 1 - j][i])
        );
        const collided = checkCollision(
            {
                ...tetromino,
                shape: rotated,
            }, newStage, { x: 0, y: 0 }
        );
        if (!collided) {
            setCurrentTetromino(tetro => ({
                ...tetro,
                shape: rotated,
            }))
            updateStage(newStage);
        }
    };







    const drop = (stage, tetromino) => {
        let newStage = deletTetromino(stage, tetromino);
        if (!checkCollision(tetromino, newStage, { x: 0, y: 1 })) {
            updateStage(newStage);
            updateCurrentTetromino(tetro => ({
                ...tetro,
                pos: {
                    ...tetro.pos,
                    y: tetro.pos.y + 1,
                }
            }));
        } else {
            updateCurrentTetromino(tetro => ({
                ...tetro,
                collided: true,
            }));
        }
    };





    const moveTetromino = (stage, tetromino, dir) => {
        if (dir.y > 0)
            drop(stage, tetromino);
        else {
            let newStage = deletTetromino(stage, tetromino);
            if (!checkCollision(tetromino, newStage, dir)) {
                updateStage(newStage);
                updateCurrentTetromino(tetro => ({
                    ...tetro,
                    pos: {
                        y: tetro.pos.y += dir.y,
                        x: tetro.pos.x += dir.x,
                    }
                }));
            }
        }


    };

    const swapRow = (stage) => {
        stage.map((row, y) => {
            if (row.findIndex(value => value === 0) === -1) {
              console.log('row', y);
            }
        });
    };

    useEffect(() => {
        // console.log(currentTetromino);
        if (!gameStart || gameOver || gameWon)
            return;
        if (!currentTetromino.collided) {
            drawTetromino()
        }
        else if (currentTetromino.collided) {
            swapRow(currentStage);
            if (checkCollision({
                pos: {
                    x: Math.ceil((STAGE_WIDTH / 2) -
                        (TETROMINOES[nextTetromino].shape.length / 2)),
                    y: 0,
                },
                shape: TETROMINOES[nextTetromino].shape,
            }, currentStage, { x: 0, y: 0 })) {
                updateGameOver(true);
                return;
            }
            swapTetrominos();
        }
    }, [currentTetromino]);

    useInterval(() => {
        drop(currentStage, currentTetromino);
    }, delay)

    useEffect(() => {
        if (gameStart && !gamePause && !gameOver) {
            setDelay(500);
        } else {
            setDelay(null);
        }
    }, [gamePause, gameOver])


    useEffect(() => {
        if (gameStart && !gamePause && !gameOver) {
            swapTetrominos();
            setDelay(500);
        } else {
            setDelay(null);
        }
    }, [gameStart])

    return [
        currentStage, updateStage,
        dropRow, setDropRow,
        score, updateScore,
        rows, updateRows,
        gameOver, updateGameOver,
        gameWon, updateGameWon,
        gameStart, startGame,
        gamePause, pauseGame,
        currentTetromino, updateCurrentTetromino,
        nextTetromino,
        resetGame,
        moveTetromino,
        rotateTetromino,
    ];
}