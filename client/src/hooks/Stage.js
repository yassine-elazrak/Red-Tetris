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
    const updateCurrentTetromino = () => {
        console.log("updateCurrentTetromino");
        setCurrentTetromino({
            pos: { x: 0, y: 0 },
            shape: TETROMINOES[nextTetromino].shape,
            collided: false,
        });
        console.log(currentTetromino, "currentTetromino");
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
        let tetromino ={...currentTetromino};
        let pos = tetromino.pos;
        const shape = tetromino.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    if ((pos.y + y + dir.y < 0) || (pos.x + x + dir.x >= STAGE_WIDTH)
                        || (pos.x + x < 0)) {
                        return true;
                    }
                    if ((pos.y + y + dir.y >= STAGE_HEIGHT) ||
                        (stage[pos.y + y + dir.y][pos.x + x + dir.x] !== 0 && shape[y][x] !== 0)) {
                        setCurrentTetromino({
                            ...currentTetromino,
                            // pos: { x: 0, y: 0 },
                            collided: true,
                        })
                        return true;
                    }

                }
            }
        }
        return false;
    };


    const moveTetromino = (dir) => {
        // console.log(currentTetromino.pos, 'currentTetromino');
        let stage = currentStage.map((row) => [...row]);
        let tetromino = {...currentTetromino};
        tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    stage[tetromino.pos.y + y][tetromino.pos.x + x] = 0;
                }
            });
        });

        if (!collided(stage, dir)) {
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
            setCurrentTetromino({
                ...currentTetromino,
                pos: newPos,
            });
        } else if (currentTetromino.collided) {
            updateCurrentTetromino();
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
            // console.log("collided");
            // let tetromino = {
            //     pos: { x: 0, y: 0 },
            //     shape: TETROMINOES[nextTetromino].shape,
            //     collided: false,
            // }
            // setCurrentTetromino(tetromino);
            // updateCurrentTetromino();
            // console.log(currentTetromino, '....');
            // setCurrentTetromino({
            //     ...currentTetromino,
            //     collided: false,
            // });
            moveTetromino({ x: 0, y: 0 });
            updateNextTetromino(randomTetromino());
        }
    }, [currentTetromino.collided]);

    useEffect(() => {
        if (!gameStart) {
            return;
        }
        // console.log('start');
        updateCurrentTetromino();
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