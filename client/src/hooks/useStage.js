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
    const [dorpTime, setDorpTime] = useState(null);

    const startGame = () => {
        setGameStart(true);
        setCurrentTetromino({
            pos: {
                x: Math.ceil((STAGE_WIDTH / 2) -
                    (TETROMINOES[nextTetromino].shape.length / 2)),
                y: ((-1 * TETROMINOES[nextTetromino].shape.length) + 1)
            },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
    };
    // const updateCurrentTetromino
    const updateDropTime = (time) => {
        setDorpTime(time);
    };
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
                y: ((-1 * TETROMINOES[nextTetromino].shape.length) + 1)
            },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
        setNextTetromino(randomTetromino);
    }
    const updateDropRow = (dropRow) => { setDropRow(dropRow); };

    const clearStage = () => {
        setCurrentStage(stage => {
            return stage.map(row => row.map((_, i) => [0, "clear"]));
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
                if (shape[y][x] !== 0) {
                    if (x + offset.x + pos.x < 0
                        || x + offset.x + pos.x >= STAGE_WIDTH
                        || y + offset.y + pos.y >= STAGE_HEIGHT) {
                        return true;
                    }
                    if (y + pos.y + offset.y >= 0) {
                        if (
                            stage[y + offset.y + pos.y] &&
                            stage[y + offset.y + pos.y][x + offset.x + pos.x] &&
                            stage[y + offset.y + pos.y][x + offset.x + pos.x][1] !== "clear"
                        ) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };


    const deleteRows = (stage) => {
        const newStage = stage.reduce((ack, row) => {
            if (row.findIndex(cell => cell[0] === 0) === -1) {
                updateScore(prevScore => prevScore + 10);
                updateRows(prevRows => prevRows + 1);
                ack.unshift(new Array(stage[0].length).fill([0, 'clear']));
                return ack;
            }
            ack.push(row);
            return ack;
        }, [])
        return newStage;
    };

    const updateStageWithTetromino = (stage, tetromino) => {
        let newStage = stage.map(row => row.map(cell =>
            cell[1] === 'clear' ? [0, 'clear'] : cell));
        tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0 && tetromino.pos.y + y >= 0) {
                    newStage[y + tetromino.pos.y][x + tetromino.pos.x] =
                        [value, !tetromino.collided ? 'clear' : 'tetromino'];
                }
            });
        });

        if (tetromino.collided) {
            // console.log(tetromino, 'tetromino.collided');
            newStage = deleteRows(newStage);
        }

        updateStage(newStage);
    }


    // rotate the tetromino
    const rotateTetromino = (stage, tetromino) => {
        let len = tetromino.shape.length - 1;
        let newTetromino = {
            ...tetromino,
            pos: {
                // ...tetromino.pos,
                x: tetromino.pos.x < 0 ? 0 :
                    tetromino.pos.x + len >= STAGE_WIDTH - 1 ? STAGE_WIDTH - 1 - len :
                        tetromino.pos.x,
                y: tetromino.pos.y,
            },
        };
        const rotated = newTetromino.shape.map((row, i) =>
            row.map((_, j) => newTetromino.shape[len - j][i])
        );
        if (!checkCollision(
            {
                ...newTetromino,
                shape: rotated,
            }, stage, { x: 0, y: 0 }
        )) {
            setCurrentTetromino({
                ...newTetromino,
                shape: rotated,
            });
        }
        else
            console.log(newTetromino, tetromino, 'newTetromino');
    };







    const drop = (stage, tetromino) => {
        if (!checkCollision(tetromino, stage, { x: 0, y: 1 })) {
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
        return tetromino;
    };





    const moveTetromino = (stage, tetromino, dir) => {
        if (dir.y > 0)
            drop(stage, tetromino);
        else {
            if (!checkCollision(tetromino, stage, dir)) {
                updateCurrentTetromino(tetro => ({
                    ...tetro,
                    pos: {
                        y: tetro.pos.y += dir.y,
                        x: tetro.pos.x += dir.x,
                    }
                }));
            }
        }
        return tetromino;
    };

    useInterval(() => {
        drop(currentStage, currentTetromino);
    }, dorpTime)

    useEffect(() => {
        if (!gameStart || gameOver || gameWon || gamePause) return;
        updateStageWithTetromino(currentStage, currentTetromino);
        if (currentTetromino.collided) {
            (currentTetromino.pos.y < 0) ? setGameOver(true) : swapTetrominos();
        }
    }, [currentTetromino]);




    useEffect(() => {
        if (gameStart && !gamePause && !gameOver) {
            swapTetrominos();
            updateDropTime(500);
        } else {
            updateDropTime(null);
        }
    }, [gameStart, gamePause, gameOver])

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
        updateDropTime,
    ];
}