import { useState, useEffect } from "react";

import {
    STAGE_HEIGHT,
    STAGE_WIDTH,
    InitStage,
} from "../helpers/StageHelper";
import { TETROMINOES, randomTetromino } from "../helpers/Tetrominoes";

export const usePlayer = () => {
    const [currentStage, setCurrentStage] = useState(InitStage());
    const [tetromino, setTetromino] = useState({
        pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
        shape: TETROMINOES[0].shape,
        collided: false,
    });
    const [nextTetromino, setNextTetromino] = useState(randomTetromino());
    const [dropRow, setDropRow] = useState(0);
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [gamePause, setGamePause] = useState(false);
    const [time, setTime] = useState(null);

    const updateNextTetromino = (nextTetromino) => {
        setNextTetromino(nextTetromino);
    };
    const startGame = () => {
        setGameStart(true);
        setTetromino({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
        updateNextTetromino(randomTetromino());
    };
    const pauseGame = () => { setGamePause(!gamePause); }
    const updateStage = (newStage) => { setCurrentStage(newStage); };
    const updateScore = (score) => { setScore(score); }
    const updateRows = (rows) => { setRows(rows); }
    const updateGameOver = (gameOver) => { setGameOver(gameOver); }
    const updateGameWon = (gameWon) => { setGameWon(gameWon); }
    const updateCurrentTetromino = (tetromino) => { setTetromino(tetromino); }
    const updateDropRow = (dropRow) => { setDropRow(dropRow); }
    const resetGame = () => {
        setGameStart(false);
        setGameOver(false);
        setGameWon(false);
        setGamePause(false);
        setScore(0);
        setRows(0);
        setCurrentStage(InitStage());
        setTetromino({
            pos: {},
            shape: [],
            collided: false,
        });
        updateNextTetromino(randomTetromino());
    };

    const tetrominoToStage = (tetromino, stage) => {
        const newStage = stage.map((row) => [...row]);
        tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newStage[y + tetromino.pos.y][x + tetromino.pos.x] = value;
                }
            });
        });
        //console.log(newStage);
        return newStage;
    }

    const checkCollision = (tetromino, stage) => {
        for (let y = 0; y < tetromino.shape.length; y++) {
            for (let x = 0; x < tetromino.shape[y].length; x++) {
                if (tetromino.shape[y][x] !== 0) {
                    if (
                        stage[y + tetromino.pos.y] &&
                        stage[y + tetromino.pos.y][x + tetromino.pos.x]
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const playerDrop = () => {
        //console.log("playerDrop");
        if (
            !checkCollision(tetromino, currentStage) &&
            !gameOver &&
            !gameWon
        ) {
            updateCurrentTetromino({
                ...tetromino,
                pos: {
                    x: tetromino.pos.x,
                    y: tetromino.pos.y + 1,
                },
            });
        } else {
            updateCurrentTetromino({
                ...tetromino,
                collided: true,
            });
            updateStage(tetrominoToStage(tetromino, currentStage));
            updateScore(score + (rows * 10));
            updateRows(rows + 1);
            updateDropRow(dropRow + 1);
            checkGameOver();
            checkGameWon();
        }
    }

    const playerMove = (dir) => {
        if (
            !checkCollision(tetromino, currentStage) &&
            !gameOver &&
            !gameWon
        ) {
            updateCurrentTetromino({
                ...tetromino,
                pos: {
                    x: tetromino.pos.x + dir,
                    y: tetromino.pos.y,
                },
            });
        }
    }

    const playerRotate = (stage, dir) => {
        const rotatedTetromino = {
            ...tetromino,
            shape: tetromino.shape.map((row) =>
                row.map((value, index) =>
                    value * dir
                )
            ),
        };
        if (
            !checkCollision(rotatedTetromino, stage) &&
            !gameOver &&
            !gameWon
        ) {
            updateCurrentTetromino({
                ...tetromino,
                shape: tetromino.shape.map((row) =>
                    row.map((value, index) =>
                        value * dir
                    )
                ),
            });
        }
    }

    const checkGameOver = () => {
        if (checkCollision(tetromino, currentStage)) {
            updateGameOver(true);
        }
    }

    const checkGameWon = () => {
        for (let y = 0; y < currentStage.length; y++) {
            for (let x = 0; x < currentStage[y].length; x++) {
                if (currentStage[y][x] === 0) {
                    return;
                }
            }
        }
        updateGameWon(true);
    }

    const startInterval = () => {
        setTime(setInterval(playerDrop, 1000));
    }

    const stopInterval = () => {
        clearInterval(time);
    }

    useEffect(() => {
        if (gameStart && !gamePause) {
            startInterval();
        } else {
            stopInterval();
        }
    }
    , [gameStart, gamePause]);

    return [
        currentStage, updateStage,
        score, updateScore,
        rows, updateRows,
        gameOver, updateGameOver,
        gameWon, updateGameWon,
        gameStart, setGameStart,
        gamePause, setGamePause,
        nextTetromino, updateNextTetromino,
        tetromino, updateCurrentTetromino,
        dropRow, updateDropRow,
        startGame,
        pauseGame,
        resetGame,

    ]



};