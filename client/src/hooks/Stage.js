import { useState } from "react";
import { InitStage } from "../helpers/StageHelper";

export const useStage = (initStag) => {
    const [currentStage, setCurrentStage] = useState(initStag);
    const [dropRow, setDropRow] = useState(0);
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [gamePause, setGamePause] = useState(false);
    const [currentTetromino, setCurrentTetromino] = useState({
        pos: { x: 0, y: 0 },
        tetromino: 0,
        collided: false,
    });
    const [nextTetromino, setNextTetromino] = useState(0);


    const startGame = () => { setGameStart(true); };
    const pauseGame = () => { setGamePause(!gamePause); };
    const updateStage = (newStage) => { setCurrentStage(newStage); };
    const updateScore = (score) => { setScore(score); };
    const updateRows = (rows) => { setRows(rows); };
    const updateGameOver = (gameOver) => { setGameOver(gameOver); };
    const updateGameWon = (gameWon) => { setGameWon(gameWon); };
    const updateCurrentTetromino = (currentTetromino) => {
        setCurrentTetromino(currentTetromino);
    };
    const updateNextTetromino = (nextTetromino) => {
        setNextTetromino(nextTetromino);
    };
    const updateDropRow = (dropRow) => { setDropRow(dropRow); };
    
    const resetGame = (NTetro) => {
        setGameStart(false);
        setGameOver(false);
        setGameWon(false);
        setGamePause(false);
        setScore(0);
        setRows(0);
        setCurrentStage(InitStage());
        setCurrentTetromino({
            pos: { x: 0, y: 5 },
            tetromino: 0,
            collided: false,
        });
        setNextTetromino(NTetro);
        setDropRow(0);
    }

    const pushToStage = (tetromino) => {
        console.log(tetromino);
        if (tetromino.tetromino == 0)
            return;
        const { pos: { x, y }, tetromino: t } = currentTetromino;
        const stage = currentStage;
        tetromino.tetromino.shape.forEach((row, yy) => {
            console.log(row, yy);
            row.forEach((value, xx) => {
                console.log(value, xx);
                // stage[yy][xx] = value;
                // if (value !== 0) {
                    stage[y + yy][x + xx] = value;
                // }
            });
        }
        );
        console.log(stage);
        updateStage(stage);
    }

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
        pushToStage,
    ];
}