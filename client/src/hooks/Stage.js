import { useEffect, useState } from "react";
import {
    STAGE_HEIGHT,
    STAGE_WIDTH,
    InitStage,
} from "../helpers/StageHelper";
import { TETROMINOES, randomTetromino } from "../helpers/Tetrominoes";

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


    const startGame = () => {
        setGameStart(true);
        setCurrentTetromino({
            pos: { x: 0, y: 0 },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
    };
    const pauseGame = () => { setGamePause(!gamePause); };
    const updateStage = (newStage) => { setCurrentStage(newStage); };
    const updateScore = (score) => { setScore(score); };
    const updateRows = (rows) => { setRows(rows); };
    const updateGameOver = (gameOver) => { setGameOver(gameOver); };
    const updateGameWon = (gameWon) => { setGameWon(gameWon); };
    const updateCurrentTetromino = (tetromino) => {
        // console.log("updateCurrentTetromino");
        setCurrentTetromino(tetromino);
        // console.log(currentTetromino, "currentTetromino");
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
            pos: {},
            shape: [],
            collided: false,
        });
        setNextTetromino(NTetro);
        setDropRow(0);
    };

    const collided = (stage, dir) => {
        let tetromino = { ...currentTetromino };
        let pos = tetromino.pos;
        const shape = tetromino.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    if (pos.x + x + dir.x < 0 || pos.x + x + dir.x > STAGE_WIDTH - 1 ||
                        pos.y + y + dir.y > STAGE_HEIGHT - 1 ||
                        (stage[pos.y + y + dir.y][pos.x + x + dir.x] !== 0)) {
                        console.log('collided');
                        if ((dir.y > 0) && ((pos.y + y + dir.y > STAGE_HEIGHT - 1) ||
                            (stage[pos.y + y + dir.y][pos.x + x + dir.x] !== 0))) {
                                // updateCurrentTetromino();
                                // setCurrentTetromino({
                                //     ...currentTetromino,
                                //     collided: true,
                                // });
                                updateCurrentTetromino({
                                    pos: { x: 0, y: 0 },
                                    shape: TETROMINOES[nextTetromino].shape,
                                    collided: true,
                                });
                            // console.log('game over');
                        }
                        // updateGameOver(true);
                        return true;
                    }
                }
            }
        }
        return false;
    };


    const moveTetromino = (dir) => {
        let stage = currentStage.map((row) => [...row]);
        let tetromino = { ...currentTetromino };
        tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    stage[tetromino.pos.y + y][tetromino.pos.x + x] = 0;
                }
            });
        });

        if (collided(stage, dir) === false) {
            // console.log(collided(stage, dir));
            tetromino.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        stage[tetromino.pos.y + y + dir.y][tetromino.pos.x + x + dir.x] = value;
                    }
                });
            });
            let newPos = { ...currentTetromino.pos };
            newPos.x += dir.x;
            newPos.y += dir.y;

            // console.log(newPos, 'newPos');

            updateStage(stage);
            console.log('moveTetromino');
            // console.log(currentTetromino, 'currentTetromino');
            console.log('updateStage<<<');
            // console.log(currentTetromino, 'currentTetromino');
            setCurrentTetromino({
                ...currentTetromino,
                pos: newPos,
            });
            console.log(currentTetromino, 'currentTetromino');
            console.log('updateStage>>>');
        }
        // console.log(currentStage, 'stage2');
    }

    // const rot

    // useEffect(() => {
    //     console.log(currentStage, 'currentStagess');
    //     // console.log(currentTetromino.pos, 'currentTetromino');
    // }, [currentTetromino.pos]);

    useEffect(() => {
        if (currentTetromino.collided) {
            console.log("<<<<<<");
            // let tetromino = {
            //     pos: { x: 0, y: 0 },
            //     shape: TETROMINOES[nextTetromino].shape,
            //     collided: false,
            // }
            // setCurrentTetromino(tetromino);
            
            // console.log(currentTetromino, 'currentTetromino');
            console.log(currentTetromino, '....');
            setCurrentTetromino({
                ...currentTetromino,
                collided: false,
            });
            if (collided(currentStage, { x: 0, y: 0 })) {
                console.log('game over');
                updateGameOver(true);
            }
            moveTetromino({ x: 0, y: 0 });
            updateNextTetromino(randomTetromino());
        }
    }, [currentTetromino.collided]);

    useEffect(() => {
        console.log(currentTetromino, 'listener');
    }, [currentTetromino]);

    useEffect(() => {
        if (!gameStart) {
            return;
        }
        // console.log('start');
        updateCurrentTetromino({
            pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
        moveTetromino({ x: 0, y: 0 });
    }, [gameStart]);

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