import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout, Row, Col, Button, Spin, Modal, message } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { TETROMINOES } from "../helpers/Tetrominoes";

import Message from "./Message";
import Players from "./Players";
import StageBar from "./StageBar";
import Stage from "./Stage";

import {
  createStage,
  updateStage,
  updateTetromino,
  leaveRoom,
  refreshRoom,
  changeStatusRoom,
  gameActions,
  continueGame,
  gameClear,
  clearPlayers,
  updateRoomToPublic
} from "../redux/actions";

// import { useStage } from "../hooks/useStage";

import { useInterval } from "../hooks/useInterval";

const { Content, Sider } = Layout;

const GameSpace = (props) => {
  const [collapsedChat, setCollapsedChat] = useState(true);
  const [triggerChat, setTriggerChat] = useState(true);
  const [triggerPlayers, setTriggerPlayers] = useState(true);
  const [collapsedPlayers, setCollapsedPlayers] = useState(true);
  const [userStage, setUserStage] = useState([]);
  const [dailyDrop, setDailyDrop] = useState(null);
  const [scor, setScor] = useState(0);
  const [rows, setRows] = useState(0);
  const [nextTetromino, setNextTetromino] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gamePause, setGamePause] = useState(false);

  const restGame = () => {
    setDailyDrop(null);
    setScor(0);
    setRows(0);
    setGameStart(false);
    setGameOver(false);
    setGameWon(false);
    setGamePause(false);
  };

  useEffect(() => {
    // props.gameClear();
    changeFocused();
    restGame();

    // props.socket.socket('/').on('updatePlayers', data => {
    //   // //console.log('updateplayer', data);
    //   props.updatePlayers(data);
    // })
    return () => {
      Modal.destroyAll();
      // props.socket.socket('/').off('updatePlayers');
    }


  }, []);

  useEffect(() => {
    if (props.game.error) {
      setDailyDrop(null);
      message.error(props.game.error);
      return;
    }
    setUserStage(props.game.map);
    setScor(props.game.scor);
    setRows(props.game.rows);
    setNextTetromino(props.game.nextTetrominos[0]);
    if (props.game.status === "gameOver") setGameOver(true);
    else if (props.game.status === "gameWinner") setGameWon(true);
    else {
      setGameOver(false);
      setGameWon(false);
    }
    //console.log(props.game.status);
  }, [props.game]);

  useEffect(() => {
    if (props.room.error) message.error(props.room.error);
    else {
      if (props.room.status === "closed") restGame();
      if (props.room.status === "end") setGameStart(false);
      if (props.room.status === "started") {
        // //console.log('game start');
        setGameStart(true);
        setGamePause(false);
      }
      if (props.room.status === "paused") setGamePause(true);
    }
    // //console.log("nextTetromino =>", props.game.nextTetrominos);
  }, [props.room]);

  const changeFocused = () => {
    document.getElementById("game-space").focus();
  };

  useInterval(() => {
    let data = {
      action: "down",
      roomId: props.room.id,
    };
    props.gameActions(data);
  }, dailyDrop);

  useEffect(() => {
    if (gameStart && !gamePause && !gameWon && !gameOver) {
      setDailyDrop(500);
      // //console.log('set daily drop');
    }
    else {
      //console.log(gameStart, gamePause, gameWon, gameOver);
      // //console.log('cleate daily drop');
      setDailyDrop(null);
    }
  }, [gameStart, gamePause, gameWon, gameOver]);



  const handleKeyDown = ({ keyCode }) => {
    if (!gameStart && keyCode === 13) {
      props.changeStatusRoom({
        roomId: props.room.id,
        status: "started",
      });
    }
    if (!gameStart) return;
    setDailyDrop(null);
    if (keyCode === 13) {
      // pauseGame(!gamePause);
      props.changeStatusRoom({
        roomId: props.room.id,
        status: gamePause ? "started" : "paused",
      });
      setGamePause(!gamePause);
    }
    let data = {
      action: "down",
      roomId: props.room.id,
    };
    if (!gameStart || gamePause || gameOver || gameWon) return;
    if (keyCode === 37 || keyCode === 74) {
      // move to left
      // moveTetromino(currentStage, currentTetromino, { x: -1, y: 0 });
      data.action = "left";
      props.gameActions(data);
    } else if (keyCode === 39 || keyCode === 76) {
      // move to right
      // moveTetromino(currentStage, currentTetromino, { x: 1, y: 0 });
      data.action = "right";
      props.gameActions(data);
    } else if (keyCode === 40 || keyCode === 75) {
      // move to down
      // moveTetromino(currentStage, currentTetromino, { x: 0, y: 1 });
      data.action = "down";
      props.gameActions(data);
    } else if (keyCode === 32 || keyCode === 72) {
      // move to goole drop
      // moveTetromino(currentStage, currentTetromino, { x: 0, y: -1 });
      data.action = "downDown";
      props.gameActions(data);
    } else if (keyCode === 38 || keyCode === 73) {
      // rotate
      // rotateTetromino(currentStage, currentTetromino);
      data.action = "rotate";
      props.gameActions(data);
    }

    // updateDropTime(500);
  };

  const handleKeyUp = (e) => {
    // //console.log("key up");
    if (gameStart && !gamePause && !gameWon && !gameOver) setDailyDrop(500);
    // if (gameStart && !gamePause && !gameWon && !gameOver) {
    //   updateDropTime(500);
    // }
  };

  // const restState = () => {
  //   setGameOver(false);
  //   setGamePause(false);
  //   setGameWon(false);
  //   setGameStart(false);
  // }

  // useEffect(() =>{
  //   //console.log('players update >>>>>>>>>>>kdjsljds');
  // }, [props.players])
  const {room, profile, gameClear, continueGame, leaveRoom} = props;

  useEffect(() => {
    const modal = () => {
      // Modal.destroyAll();
      return Modal.confirm({
        width: "500px",
        title: gameOver ? "Game Over" : "Game Won",
        content: (
          <>
            {gameOver ? "You lose!" : "You are Winner"}
            {room.admin !== profile.id && (
              <p>
                you will leave automatically when admin close this room
              </p>
            )}
          </>
        ),
        onOk() {
          gameClear();
          continueGame({ roomId: room.id });
        },
        onCancel() {
          leaveRoom();
        },
        okText: "Continue",
        cancelText: "Leave Room",
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
    if (gameOver || gameWon) {
      console.log(gameOver, gameWon);
      modal();
      setDailyDrop(null);
    }
  }, [gameOver, gameWon, room.id, room.admin, profile.id, gameClear, continueGame, leaveRoom]);

  // MOBILE ACTIONS

  // const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  // const handleTouchEnd = ({ changedTouches }) => {
  //   if (!gameStart) return;
  //   ////console.log("starting");
  //   const { clientX, clientY } = changedTouches[0];
  //   const deltaX = clientX - touchStart.x;
  //   const deltaY = clientY - touchStart.y;
  //   ////console.log(deltaX, " ", deltaY);
  //   if (deltaX === deltaY)
  //     moveTetromino(currentStage, currentTetromino, { x: 0, y: -1 });
  //   if (Math.abs(deltaX) > Math.abs(deltaY)) {
  //     if (deltaX > 0) {
  //       ////console.log("right");
  //       moveTetromino(currentStage, currentTetromino, { x: 1, y: 0 });
  //     } else {
  //       moveTetromino(currentStage, currentTetromino, { x: -1, y: 0 });
  //       ////console.log("left");
  //     }
  //   } else {
  //     if (deltaY < 0) {
  //       rotateTetromino(currentStage, currentTetromino);
  //       ////console.log("rotate");
  //     }
  //   }
  //   // updateDropTime(500);
  // };

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
              !gameStart &&
                props.changeStatusRoom({
                  roomId: props.room.id,
                  status: "started",
                });
              // gameStart ? //console.log("reset Game") : setGameStart(true);
              changeFocused();
            }}
          >
            {gameStart ? "Reset" : "Start"}
          </Button>
        )}
        {props.profile.id === props.room.admin && gameStart && !gameOver && !gameWon && (
          <Button
            type="primary"
            disabled={!props.room.admin === props.profile.id}
            onClick={() => {
              props.changeStatusRoom({
                roomId: props.room.id,
                status: !gamePause ? "paused" : "started",
              });
              // setGamePause(!gamePause);
              changeFocused();
            }}
          >
            {gamePause ? "Resume" : "Pause"}
          </Button>
        )}
        {/* {(gameWon || gameOver) && (
          <Spin />
        )} */}
        {props.room.isPrivate && (
          <Button
            type="primary"
            hidden={gameStart}
            onClick={() => {
              //console.log("swithcroom");
              props.updateRoomToPublic({ roomId: props.room.id });
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
      {!props.room.isPrivate && (
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
      )}
      <Content
        id="game-space"
        role="button"
        tabIndex="0"
        onKeyDown={(e) => handleKeyDown(e)}
        onKeyUp={(e) => handleKeyUp(e)}
        onTouchStart={(e) => {
          // if (gameStart) updateDropTime(null);
          // setTouchStart({
          //   x: e.changedTouches[0].clientX,
          //   y: e.changedTouches[0].clientY,
          // });
        }}
        onTouchEnd={(e) => {
          console.log(e)
          // handleTouchEnd(e);
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
        <Row style={{
          width: "100%",
          justifyContent: "center",
          background: 'rgba(0,0,0,0.3)',
        }}>
          <Col xs={24} sm={24} md={24} lg={20} xl={15} xxl={9}>
            <StageBar
              shape={TETROMINOES[nextTetromino].shape}
              score={scor}
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
            <Spin
              spinning={gameOver || gameWon}
              tip={props.profile.id !== props.room.admin ? "Waiting admin close this room" : null}
              style={{
                color: 'black',
                fontSize: 20,
              }}
            >
              <Stage stage={userStage} />
            </Spin>
            {bottons()}
          </Col>
        </Row>
      </Content>
      {!props.room.isPrivate && (
      <Sider
        collapsedWidth={0}
        width={280}
        breakpoint="lg"
        reverseArrow={true}
        collapsed={collapsedChat}
        onCollapse={collapsed => {
          setCollapsedChat(collapsed);
          window.innerWidth <= 350 && setTriggerPlayers(collapsed);
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
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    room: state.room,
    socket: state.socket.socket,
    game: state.game,
    players: state.players,
  };
};

export default connect(mapStateToProps, {
  createStage,
  updateStage,
  updateTetromino,

  leaveRoom,
  refreshRoom,
  changeStatusRoom,
  gameActions,
  continueGame,
  gameClear,
  clearPlayers,
  updateRoomToPublic,
})(GameSpace);
