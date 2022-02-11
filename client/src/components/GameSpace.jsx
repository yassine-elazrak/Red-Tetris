import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, Button, Popover, Modal, message, notification } from "antd";
import {
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
// import {
//   InitStage,
//   CreateStage,
//   STAGE_HEIGHT,
//   STAGE_WIDTH,
// } from "../helpers/StageHelper";
import { TETROMINOES, randomTetromino } from "../helpers/Tetrominoes";
// import { TetrominoStyle } from "./styles/TetrominoStyle";

import Message from "./Message";
import Players from "./Players";
import StageBar from "./StageBar";
import Stage from "./Stage";

import {
  createStage,
  updateStage,
  // updateCell,
  updateTetromino,
  leaveRoom,
  refreshRoom,
  refreshInvite,
} from "../redux/actions";

import { useStage } from "../hooks/useStage";

const { Content } = Layout;

const GameSpace = (props) => {
  const { room } = props;

  const [
    currentStage,
    score,
    rows,
    gameOver,
    gameWon,
    gameStart,
    startGame,
    gamePause,
    pauseGame,
    currentTetromino,
    nextTetromino,
    resetGame,
    moveTetromino,
    rotateTetromino,
    updateDropTime,
  ] = useStage();

  const changeFocused = () => {
    document.getElementById("game-space").focus();
  };

  useEffect(() => {
    changeFocused();
    props.socket.socket("/").on("updateRoom", data => {
      props.refreshRoom(data);
    })
    // props.socket.socket("/").on("updateInvit", data => {
    //   console.log('update invit ==========>', data);
    //   props.refreshInvite(data);
    // })
    return() => {
      props.socket.socket("/").off("updateRoom");

    }

  }, []);

  const handleKeyDown = ({ keyCode }) => {
    if (!gameStart && keyCode === 13) {
      startGame();
    }
    if (!gameStart) return;
    updateDropTime(null);
    if (keyCode === 13) {
      pauseGame(!gamePause);
    }
    if (!gameStart || gamePause || gameOver || gameWon) return;
    if (keyCode === 37 || keyCode === 74) {
      // move to left
      moveTetromino(currentStage, currentTetromino, { x: -1, y: 0 });
    } else if (keyCode === 39 || keyCode === 76) {
      // move to right
      moveTetromino(currentStage, currentTetromino, { x: 1, y: 0 });
    } else if (keyCode === 40 || keyCode === 75) {
      // move to down
      moveTetromino(currentStage, currentTetromino, { x: 0, y: 1 });
    } else if (keyCode === 32 || keyCode === 72) {
      // move to goole drop
      moveTetromino(currentStage, currentTetromino, { x: 0, y: -1 });
    } else if (keyCode === 38 || keyCode === 73) {
      // rotate
      rotateTetromino(currentStage, currentTetromino);
    }

    // updateDropTime(500);
  };

  const handleKeyUp = (e) => {
    // console.log('key up');
    if (gameStart && !gamePause && !gameWon && !gameOver) {
      updateDropTime(500);
    }
  };

  const handleLiveRoom = () => {
    console.log("handleLiveRoom");
  };

  useEffect(() => {
    const modal = () => {
      Modal.confirm({
        width: "500px",
        title: gameOver ? "Game Over" : "Game Won",
        content: gameOver ? "You lose!" : "You win!",
        onOk() {
          resetGame(randomTetromino());
          changeFocused();
        },
        onCancel() {
          handleLiveRoom();
        },
        okText: "Continue",
        cancelText: "Live Room",
        cancelButtonProps: {
          type: "danger",
        },
        style: {
          justifyContent: "space-around",
        },
        icon: gameOver ? (
          <CloseCircleOutlined style={{ fontSize: "50px", color: "red" }} />
        ) : (
          <CheckCircleOutlined style={{ fontSize: "50px", color: "green" }} />
        ),
      });
    };
    if (gameOver || gameWon) modal();
  }, [gameOver, gameWon, resetGame]);

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const handleTouchEnd = ({ changedTouches }) => {
    if (!gameStart) return;
    console.log("starting");
    const { clientX, clientY } = changedTouches[0];
    const deltaX = clientX - touchStart.x;
    const deltaY = clientY - touchStart.y;
    console.log(deltaX, " ", deltaY);
    if (deltaX === deltaY)
      moveTetromino(currentStage, currentTetromino, { x: 0, y: -1 });
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        console.log("right");
        moveTetromino(currentStage, currentTetromino, { x: 1, y: 0 });
      } else {
        moveTetromino(currentStage, currentTetromino, { x: -1, y: 0 });
        console.log("left");
      }
    } else {
      if (deltaY < 0) {
        rotateTetromino(currentStage, currentTetromino);
        console.log("rotate");
      }
    }
    updateDropTime(500);
  };

  const bottons = () => {
    return (
      <div
        style={{
          padding: "10px",
          margin: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {props.auth.id === props.room.admin && (
          <Button
            type="primary"
            hidden={gameStart}
            onClick={() => {
              gameStart ? resetGame(randomTetromino()) : startGame();
              changeFocused();
            }}
          >
            {gameStart ? "Reset" : "Start"}
          </Button>
        )}
        {gameStart && (
          <Button
            type="primary"
            disabled={!props.room.admin === props.auth.id}
            onClick={() => {
              pauseGame(!gamePause);
              changeFocused();
            }}
          >
            {gamePause ? "Resume" : "Pause"}
          </Button>
        )}
        <Button
          type="primary"
          onClick={() => {
            props.leaveRoom();
          }}
        >
          Leave
        </Button>
      </div>
    );
  };

  return (
    <Content
      id="game-space"
      role="button"
      tabIndex="0"
      onKeyDown={(e) => handleKeyDown(e)}
      onKeyUp={(e) => handleKeyUp(e)}
      onTouchStart={(e) => {
        if (gameStart) updateDropTime(null);
        setTouchStart({
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
        });
      }}
      onTouchEnd={(e) => {
        handleTouchEnd(e);
      }}
      style={{
        padding: 0,
        margin: 0,
        height: "calc(100vh - 90px)",
        paddingBottom: "30px",
        marginTop: "-10px",
        marginBottom: "-20px",
        overflow: "hidden",
      }}
    >
      <Row style={{}}>
        <Col span={24}>
          <StageBar
            shape={TETROMINOES[nextTetromino].shape}
            score={score}
            rows={rows}
            color={TETROMINOES[nextTetromino].color}
          />
        </Col>
      </Row>
      <Row
        style={{
          height: "calc(100vh - 220px)",
        }}
      >
        {!room.isPravite && (
          <Col
            xs={0}
            sm={0}
            md={6}
            lg={7}
            xl={6}
            xxl={5}
            style={{
              margin: "auto",
            }}
          >
            <Players />
          </Col>
        )}
        <Col
          xs={24}
          sm={13}
          md={12}
          lg={10}
          xl={9}
          xxl={9}
          style={{
            padding: "0px",
            margin: "auto",
            width: "100%",
          }}
        >
          <Stage stage={currentStage} />
          <Row
            style={{
              marginTop: "0",
            }}
          >
            <Col
              xs={0}
              sm={0}
              md={24}
              lg={24}
              xl={24}
              xxl={24}
              style={{
                padding: 0,
              }}
            >
              {bottons()}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={0}
              lg={0}
              xl={0}
              xxl={0}
              style={{
                marginTop: "10px",
                paddingLeft: "10px",
              }}
            >
              <Popover
                trigger={"click"}
                content={bottons()}
                placement="topRight"
                color={"rgba(0,0,0,0.8)"}
                overlayStyle={{
                  width: "90%",
                }}
              >
                <Button
                  type="primary"
                  shape="circle"
                  style={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    margin: 0,
                  }}
                >
                  <SettingOutlined
                    style={{
                      margin: "auto",
                      fontSize: "20px",
                    }}
                  />
                </Button>
              </Popover>
            </Col>
          </Row>
        </Col>
        {!room.isPravite && (
          <Col
            xs={0}
            sm={11}
            md={6}
            lg={7}
            xl={6}
            xxl={5}
            style={{
              height: "100%",
            }}
          >
            <Message />
          </Col>
        )}
      </Row>
    </Content>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    room: state.room,
    socket: state.socket.socket,
  };
};

export default connect(mapStateToProps, {
  createStage,
  updateStage,
  updateTetromino,

  leaveRoom,
  refreshRoom,
  refreshInvite,
})(GameSpace);
