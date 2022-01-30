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
                if (shape[y][x] !== 0 && y + pos.y + offset.y > 0) {
                    if (y + offset.y + pos.y < 0 || y + offset.y + pos.y >= STAGE_HEIGHT
                        || x + offset.x + pos.x >= STAGE_WIDTH || x + offset.x + pos.x < 0) {
                        return true;
                    }
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
        return false;
    };


    const swapRow = (stage) => {
        let rows = 0;
        let score = 0;
        const newStage = stage.reduce((ack, row) => {
            if (row.findIndex(cell => cell[0] === 0) === -1) {
                score += 10;
                rows++;
                ack.unshift(new Array(stage[0].length).fill([0, 'clear']));
                return ack;
            }
            ack.push(row);
            return ack;
        }, [])
        // updateStage(newStage);
        // console.log(score, rows, 'score, rows');
        updateScore(prev => prev + score);
        updateRows(prev => prev + rows);
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
            console.log(tetromino, 'tetromino.collided');
            newStage = swapRow(newStage);
        }

        updateStage(newStage);
    }


    // rotate the tetromino
    const rotateTetromino = (stage, tetromino) => {
        let len = tetromino.shape.length;
        const rotated = tetromino.shape.map((row, i) =>
            row.map((_, j) => tetromino.shape[len - 1 - j][i])
        );
        const collided = checkCollision(
            {
                ...tetromino,
                shape: rotated,
            }, stage, { x: 0, y: 0 }
        );
        if (!collided) {
            setCurrentTetromino(tetro => ({
                ...tetro,
                shape: rotated,
            }))
        }
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


    };



    // useEffect(() => {
    //     if (currentTetromino.collided)
    //         swapRow(currentStage);

    // }, [currentTetromino.collided]);

    useEffect(() => {
        if (!gameStart || gameOver || gameWon)
            return;
        // if (!currentTetromino.collided)
        // console.log(currentTetromino, 'currentTetromino');
        updateStageWithTetromino(currentStage, currentTetromino);
        if (currentTetromino.collided) {
            // if (checkCollision({
            //     pos: {
            //         x: Math.ceil((STAGE_WIDTH / 2) -
            //             (TETROMINOES[nextTetromino].shape.length / 2)),
            //         y: ((-1 * TETROMINOES[nextTetromino].shape.length) + 1)
            //     },
            //     shape: TETROMINOES[nextTetromino].shape,
            // }, currentStage, { x: 0, y: 0 })) {
            //     updateGameOver(true);
            //     return;
            // }
            if (currentTetromino.pos.y < 0)
                updateGameOver(true);
            else
                swapTetrominos();
        }
    }, [currentTetromino]);

    // useEffect(() => {
    //     if (!gameStart || gameOver || gameWon)
    //         return;
    //     if (currentTetromino.collided) {
    //         // updateStageWithTetromino(currentStage, currentTetromino,
    //         // swapRow(currentStage));
    //         // updateStage(
    //         //     swapRow(currentStage)
    //         // );
    //         if (checkCollision({
    //             pos: {
    //                 x: Math.ceil((STAGE_WIDTH / 2) -
    //                     (TETROMINOES[nextTetromino].shape.length / 2)),
    //                 y: 0,
    //             },
    //             shape: TETROMINOES[nextTetromino].shape,
    //         }, currentStage, { x: 0, y: 0 })) {
    //             updateGameOver(true);
    //             return;
    //         }
    //         swapTetrominos();
    //     }

    // }, [currentTetromino.collided]);

    useInterval(() => {
        drop(currentStage, currentTetromino);
    }, dorpTime)

    useEffect(() => {
        if (gameStart && !gamePause && !gameOver) {
            updateDropTime(500);
        } else {
            updateDropTime(null);
        }
    }, [gamePause, gameOver])


    useEffect(() => {
        if (gameStart && !gamePause && !gameOver) {
            swapTetrominos();
            updateDropTime(500);
        } else {
            updateDropTime(null);
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
        updateDropTime,
    ];
}