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
    const [currentTetromino, setCurrentTetromino] = useState(TETROMINOES[0].shape);
    const [nextTetromino, setNextTetromino] = useState(randomTetromino());
    const [delay, setDelay] = useState(null);

    const startGame = () => {
        setGameStart(true);
        setCurrentTetromino({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
    };
    const pauseGame = () => { setGamePause(!gamePause); };
    const updateStage = (newStage, f) => { setCurrentStage([...newStage]) };
    const updateScore = (score) => { setScore(score); };
    const updateRows = (rows) => { setRows(rows); };
    const updateGameOver = (gameOver) => { setGameOver(gameOver); };
    const updateGameWon = (gameWon) => { setGameWon(gameWon); };
    const updateCurrentTetromino = (tetromino) => {
        // console.log(tetromino, 'tetromino');
        setCurrentTetromino(tetromino);
    };
    const updateNextTetromino = (nextTetromino) => {
        setNextTetromino(nextTetromino);
    };

    const swapTetrominos = () => {
        setCurrentTetromino({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
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
            pos: {},
            shape: [],
            collided: false,
        });
        setNextTetromino(NTetro);
        setDropRow(0);
    };

    const checkCollision = (tetromino, stage, offset) => {
        const { pos, shape } = tetromino;
        // if (offset.x === 0 && offset.y === 0) {
        //     return false;
        // }
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    if (y + offset.y + pos.y < 0 || y + offset.y + pos.y >= STAGE_HEIGHT
                        || x + offset.x + pos.x >= STAGE_WIDTH || x + offset.x + pos.x < 0) {
                        // console.log('true1', );
                        return true;
                    }
                    if (

                        stage[y + offset.y + pos.y][x + offset.x + pos.x] &&
                        stage[y + offset.y + pos.y][x + offset.x + pos.x] !== 0
                    ) {
                        // console.log('true');
                        return true;
                    }
                }
            }
        }
        console.log('flase');
        return false;
    };


    const deletTetromino = () => {
        const newStag = currentStage.map(row => [...row]);
        currentTetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newStag[y + currentTetromino.pos.y][x + currentTetromino.pos.x] = 0;
                }
            });
        });
        return newStag;
    }

    const drawTetromino = () => {
        const newStag = currentStage.map(row => [...row])
        currentTetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newStag[y + currentTetromino.pos.y][x + currentTetromino.pos.x] = value;
                }
            });
        });
        updateStage(newStag);
        return newStag;
    };


    // rotate the tetromino
    const rotateTetromino = (tetromino) => {
        let newStage = deletTetromino();
        let len = tetromino.shape.length;
        const rotated = tetromino.shape.map((row, i) =>
            row.map((val, j) => tetromino.shape[len - 1 - j][i])
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







    const drop = (tetromino) => {
        let newStage = deletTetromino();
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
            setCurrentTetromino({
                collided: true,
            });
            if (tetromino.pos.y === 0){
                updateGameOver(true);
            }
        }
    };





    const moveTetromino = (dir) => {
        if (dir.y > 0)
            drop(currentTetromino)
        else {
            let newStage = deletTetromino();
            if (!checkCollision(currentTetromino, newStage, dir)) {
                updateStage(newStage);
                updateCurrentTetromino(tetro => ({
                    ...tetro,
                    pos: {
                        // ...tetro.pos,
                        y: tetro.pos.y += dir.y,
                        x: tetro.pos.x += dir.x,
                    }
                }));
            }
        }


    };

    // useEffect(() => {
    //     console.log(currentStage, '>>>><<<');
    // }, [currentStage]);

    useEffect(() => {
        // console.log(currentTetromino);
        if (!gameStart || gameOver || gamePause)
            return;
        if (!currentTetromino.collided)
            drawTetromino()
        else if (currentTetromino.collided)
            swapTetrominos();
    }, [currentTetromino]);

    useInterval(() => {
        drop(currentTetromino);
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
        nextTetromino, updateNextTetromino,
        resetGame,
        moveTetromino,
        rotateTetromino,
    ];
}