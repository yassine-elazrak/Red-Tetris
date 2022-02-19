import { useEffect, useState } from "react";
import { STAGE_HEIGHT, STAGE_WIDTH, InitStage } from "../helpers/StageHelper";
import { TETROMINOES, randomTetromino } from "../helpers/Tetrominoes";
import { useInterval } from "./useInterval";

export const useStage = () => {
  // ////console.log("useStage");
  // useEffect(() => {
  const [currentStage, setCurrentStage] = useState(InitStage());
  // const [dropRow, setDropRow] = useState(0);
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [gamePause, setGamePause] = useState(false);
  const [currentTetromino, setCurrentTetromino] = useState({
    position: { x: 0, y: 0 },
    shape: [],
    shadow: 0,
    collided: false,
  });
  const [nextTetromino, setNextTetromino] = useState(0);
  const [dorpTime, setDorpTime] = useState(null);

  const startGame = () => {
    setGameStart(true);
    setCurrentTetromino({
      position: {
        x: Math.ceil(
          STAGE_WIDTH / 2 - TETROMINOES[nextTetromino].shape.length / 2
        ),
        y: -1 * TETROMINOES[nextTetromino].shape.length + 1,
      },
      shape: TETROMINOES[nextTetromino].shape,
      shadow: 0,
      collided: false,
    });
  };
  // const updateCurrentTetromino
  const updateDropTime = (time) => {
    setDorpTime(time);
  };
  const pauseGame = () => {
    setGamePause(!gamePause);
  };
  const updateStage = (newStage) => {
    setCurrentStage([...newStage]);
  };
  const updateScore = (score) => {
    setScore(score);
  };
  const updateRows = (rows) => {
    setRows(rows);
  };
  // const updateGameOver = (gameOver) => {
  //   setGameOver(gameOver);
  // };
  // const updateGameWon = (gameWon) => {
  //   setGameWon(gameWon);
  // };
  const updateCurrentTetromino = (tetromino) => {
    setCurrentTetromino(tetromino);
  };
  const swapTetrominos = () => {
    setCurrentTetromino({
      position: {
        x: Math.ceil(
          STAGE_WIDTH / 2 - TETROMINOES[nextTetromino].shape.length / 2
        ),
        y: -1 * TETROMINOES[nextTetromino].shape.length + 1,
      },
      shape: TETROMINOES[nextTetromino].shape,
      shadow: 0,
      collided: false,
    });
    setNextTetromino(randomTetromino);
  };
  // const updateDropRow = (dropRow) => {
  //   setDropRow(dropRow);
  // };

  const clearStage = () => {
    setCurrentStage((stage) => {
      return stage.map((row) => row.map((_, i) => [0, "clear"]));
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
      position: { x: 0, y: 0 },
      shape: [],
      collided: false,
    });
    setNextTetromino(NTetro);
    // setDropRow(0);
  };

  const checkCollision = (stage, tetromino, offset) => {
    const { position, shape } = tetromino;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          if (
            x + offset.x + position.x < 0 ||
            x + offset.x + position.x >= STAGE_WIDTH ||
            y + offset.y + position.y >= STAGE_HEIGHT
          ) {
            return true;
          }
          if (y + position.y + offset.y >= 0) {
            if (
              stage[y + offset.y + position.y] &&
              stage[y + offset.y + position.y][x + offset.x + position.x] &&
              stage[y + offset.y + position.y][x + offset.x + position.x][1] ===
                "tetromino"
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
    let rows = 0;
    let score = 0;
    let percent = 0;
    const newStage = stage.reduce((ack, row) => {
      if (row.findIndex((cell) => cell[0] === 0) === -1) {
        rows++;
        // updateScore((prevScore) => prevScore + 10);
        // updateRows((prevRows) => prevRows + 1);
        ack.unshift(new Array(stage[0].length).fill([0, "clear"]));
        return ack;
      }
      ack.push(row);
      return ack;
    }, []);
    if (rows > 0) {
      score = rows * 10;
      percent = Math.round((rows / 100) * 4 * 10) * 10;
      //   ////console.log(Math.round(((rows / 100) * 4) * 10), 'percent', (rows / 100) * 3);
      updateScore((prevScore) => prevScore + score + percent);
      updateRows((prevRows) => prevRows + rows);
    }
    return newStage;
  };

  const updateStageWithTetromino = (stage, tetromino) => {
    let newStage = stage.map((row) =>
      row.map((cell) =>
        cell[1] === "clear" || cell[1] === "shadow" ? [0, "clear"] : cell
      )
    );
    tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          // ////console.log(y + tetromino.pos.y + tetromino.shadow, 'shadow');
          if (y + tetromino.position.y + tetromino.shadow > 0) {
            newStage[y + tetromino.position.y + tetromino.shadow][
              x + tetromino.position.x
            ] = [value, "shadow"];
          }
          if (tetromino.position.y + y >= 0) {
            newStage[y + tetromino.position.y][x + tetromino.position.x] = [
              value,
              !tetromino.collided ? "clear" : "tetromino",
            ];
          }
        }
      });
    });

    if (tetromino.collided) {
      newStage = deleteRows(newStage);
    }

    updateStage(newStage);
  };

  // calculate the goole position of the tetromino
  const gooleDrop = (stage, tetromino) => {
    let drop = 0;
    while (!checkCollision(stage, tetromino, { x: 0, y: drop })) {
      drop++;
    }
    // ////console.log(drop, "drop");
    return drop ? drop - 1 : 0;
  };

  // rotate the tetromino
  const rotateTetromino = (stage, tetromino) => {
    let len = tetromino.shape.length - 1;
    let newTetromino = {
      ...tetromino,
      position: {
        // ...tetromino.pos,
        x:
          tetromino.position.x < 0
            ? 0
            : tetromino.position.x + len >= STAGE_WIDTH - 1
            ? STAGE_WIDTH - 1 - len
            : tetromino.position.x,
        y: tetromino.position.y,
      },
    };
    const rotated = newTetromino.shape.map((row, i) =>
      row.map((_, j) => newTetromino.shape[len - j][i])
    );
    if (
      !checkCollision(
        stage,
        {
          ...newTetromino,
          shape: rotated,
        },
        { x: 0, y: 0 }
      )
    ) {
      setCurrentTetromino({
        ...newTetromino,
        shape: rotated,
      });
    }
    ////console.log(newTetromino, tetromino, "newTetromino");
  };

  const drop = (stage, tetromino) => {
    if (!checkCollision(stage, tetromino, { x: 0, y: 1 })) {
      updateCurrentTetromino((tetro) => ({
        ...tetro,
        position: {
          ...tetro.position,
          y: tetro.position.y + 1,
        },
      }));
    } else {
      updateCurrentTetromino((tetro) => ({
        ...tetro,
        collided: true,
      }));
    }
    return tetromino;
  };

  const moveTetromino = (stage, tetromino, dir) => {
    // drop the tetromino
    if (dir.y > 0) drop(stage, tetromino);
    // move the tetromino to goole position
    else if (dir.y === -1) {
      updateCurrentTetromino({
        ...tetromino,
        position: {
          ...tetromino.position,
          y: tetromino.position.y + gooleDrop(stage, tetromino),
        },
      });
    } else {
      if (!checkCollision(stage, tetromino, dir)) {
        // let shadow = gooleDrop(stage, tetromino);
        updateCurrentTetromino((tetro) => ({
          ...tetro,
          position: {
            y: (tetro.position.y += dir.y),
            x: (tetro.position.x += dir.x),
          },
        }));
      }
    }
    return tetromino;
  };

  useInterval(() => {
    drop(currentStage, currentTetromino);
  }, dorpTime);

  useEffect(() => {
    if (!gameStart || gameOver || gameWon || gamePause) return;
    let shadow = gooleDrop(currentStage, currentTetromino);
    updateStageWithTetromino(currentStage, {
      ...currentTetromino,
      shadow,
    });
    if (currentTetromino.collided) {
      currentTetromino.position.y < 0 ? setGameOver(true) : swapTetrominos();
    }
  }, [currentTetromino]);

  // useEffect(() => {
  //   if (gameStart && !gamePause && !gameOver) {
  //     swapTetrominos();
  //     updateDropTime(500);
  //   } else {
  //     updateDropTime(null);
  //   }
  // }, [gameStart]);

  useEffect(() => {
    if (gameStart && !gamePause && !gameOver) {
      updateDropTime(500);
    } else {
      updateDropTime(null);
    }
  }, [gamePause]);

  return [
    currentStage,
    score,
    setScore,
    rows,
    setRows,
    gameOver,
    gameWon,
    gameStart,
    startGame,
    gamePause,
    pauseGame,
    currentTetromino,
    nextTetromino,
    setNextTetromino,
    resetGame,
    moveTetromino,
    rotateTetromino,
    updateDropTime,
  ];
};
