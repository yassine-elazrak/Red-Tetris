import { useEffect, useState } from "react";
import {
    STAGE_HEIGHT,
    STAGE_WIDTH,
    InitStage,
} from "../helpers/StageHelper";

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
        pos: [],
        type: 0,
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
        console.log(currentTetromino);
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
            pos: [],
            type: 0,
            collided: false,
        });
        setNextTetromino(NTetro);
        setDropRow(0);
    };

    const collided = (tetromino, stage, dir) => {
        // tetromino.pos.forEach((pos) => {
        //     // console.log(pos, STAGE_HEIGHT, STAGE_WIDTH, 'pos');
        //     if (pos[1] <= STAGE_WIDTH -2) {
        //         console.log(pos[1], STAGE_WIDTH, 'pos[0]');
        //         return true;
        //     }
        //     if (stage[pos[1] + dir.x][pos[0] + dir.y] !== 0) {
        //         return true;
        //     }
        // });
        // console.log('false');
        // return false;
        console.log(tetromino.pos, 'tetromino.pos');
        for (let i = 0; i < tetromino.pos.length; i++) {
            let x = tetromino.pos[i][1];
            let y = tetromino.pos[i][0];
            if (y + dir.y > STAGE_HEIGHT - 1 || x + dir.x > STAGE_WIDTH - 1
                || x + dir.x < 0) {
                return true;
            }
            if (stage[y + dir.y][x + dir.x] !== 0) {
                return true;
            }
        }
        console.log('false');
        return false;
    };
        

    const moveTetromino = (dir) => {
        const tetromino = currentTetromino;
        const stage = currentStage;
        const newTetrominoPos = tetromino.pos;
        tetromino.pos.forEach((pos) => {
            stage[pos[0]][pos[1]] = 0;
        });
        if (collided(tetromino, stage, dir)) {
            return ;
        }
        console.log(tetromino, 'tetromino');
        tetromino.pos.forEach((pos, index) => {
            stage[pos[0] + dir.y][pos[1] + dir.x] = tetromino.type;
            newTetrominoPos[index] = [pos[0] + dir.y, pos[1] + dir.x];
        });
        console.log(stage);
        setCurrentTetromino({
            ...tetromino,
            pos: newTetrominoPos,
        });

        console.log(currentTetromino.pos, 'currentTetromino');

        updateStage(stage);
    }

    // useEffect(() => {
    //         moveTetromino(currentTetromino, { x: 4, y: 0 });
    // }, [currentTetromino]);

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
    ];
}