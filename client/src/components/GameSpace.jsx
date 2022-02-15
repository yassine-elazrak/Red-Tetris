import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, Button, Popover, Modal } from "antd";
import {
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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
} from "../redux/actions";

import { useStage } from "../hooks/useStage";

const { Content, Sider } = Layout;

const GameSpace = (props) => {
  // const { room } = props;
  const [collapsedChat, setCollapsedChat] = useState(true);
  const [triggerChat, setTriggerChat] = useState(true);
  const [triggerPlayers, setTriggerPlayers] = useState(true);
  const [collapsedPlayers, setCollapsedPlayers] = useState(true);

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
    // //console.log('key up');
    if (gameStart && !gamePause && !gameWon && !gameOver) {
      updateDropTime(500);
    }
  };

  const handleLiveRoom = () => {
    //console.log("handleLiveRoom");
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
    //console.log("starting");
    const { clientX, clientY } = changedTouches[0];
    const deltaX = clientX - touchStart.x;
    const deltaY = clientY - touchStart.y;
    //console.log(deltaX, " ", deltaY);
    if (deltaX === deltaY)
      moveTetromino(currentStage, currentTetromino, { x: 0, y: -1 });
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        //console.log("right");
        moveTetromino(currentStage, currentTetromino, { x: 1, y: 0 });
      } else {
        moveTetromino(currentStage, currentTetromino, { x: -1, y: 0 });
        //console.log("left");
      }
    } else {
      if (deltaY < 0) {
        rotateTetromino(currentStage, currentTetromino);
        //console.log("rotate");
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
        {props.profile.id === props.room.admin && (
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
            disabled={!props.room.admin === props.profile.id}
            onClick={() => {
              pauseGame(!gamePause);
              changeFocused();
            }}
          >
            {gamePause ? "Resume" : "Pause"}
          </Button>
        )}
        {props.room.isPravite && (
          <Button
            type="primary"
            hidden={gameStart}
            onClick={() => {
              console.log("swithcroom");
            }}
          >
           chnage room to public
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
    <Layout
      style={{
        background: "none",
      }}
    >
      <Sider
        collapsedWidth={0}
        width={280}
        breakpoint="lg"
        onCollapse={(collapsed) => {
          setCollapsedPlayers(collapsed);
          window.innerWidth <= 350 && setTriggerChat(collapsed);
        }}
        trigger={
          triggerPlayers ? (
            collapsedPlayers ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )
          ) : null
        }
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          marginTop: 50,
          padding: 0,
          position: "absolute",
          zIndex: 10,
        }}
      >
        <Players />
      </Sider>
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
            {bottons()}
          </Col>
        </Row>
      </Content>
      <Sider
        collapsedWidth={0}
        width={280}
        breakpoint="lg"
        reverseArrow={true}
        collapsed={collapsedChat}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
          setCollapsedChat(collapsed);
          window.innerWidth <= 350 && setTriggerPlayers(collapsed);
          // console.log(window.innerWidth);
        }}
        trigger={
          triggerChat ? (
            collapsedChat ? (
              <MenuFoldOutlined />
            ) : (
              <MenuUnfoldOutlined />
            )
          ) : null
        }
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 10,
          marginTop: 50,
          padding: 0,
          paddingBottom: 5,
          position: "absolute",
          right: 0,
        }}
      >
        <Message />
      </Sider>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
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
})(GameSpace);
