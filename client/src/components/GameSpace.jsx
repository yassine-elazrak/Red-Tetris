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
import { CreateStage } from "../helpers/StageHelper"
import { StageStyled } from './styles/StageStyled'
import Message from "./Message";
import Players from "./Players";
import StageBar from "./StageBar";

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
    changeFocused();
    restGame();
    return () => {
      Modal.destroyAll();
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
  }, [props.game]);

  useEffect(() => {
    if (props.room.error) message.error(props.room.error);
    else {
      if (props.room.status === "closed") restGame();
      if (props.room.status === "end") setGameStart(false);
      if (props.room.status === "started") {
        setGameStart(true);
        setGamePause(false);
      }
      if (props.room.status === "paused") setGamePause(true);
    }
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
    }
    else {
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
      data.action = "left";
      props.gameActions(data);
    } else if (keyCode === 39 || keyCode === 76) {
      data.action = "right";
      props.gameActions(data);
    } else if (keyCode === 40 || keyCode === 75) {
      data.action = "down";
      props.gameActions(data);
    } else if (keyCode === 32 || keyCode === 72) {
      data.action = "dropDown";
      props.gameActions(data);
    } else if (keyCode === 38 || keyCode === 73) {
      data.action = "rotate";
      props.gameActions(data);
    }
  };

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const handleTouchEnd = (e) => {
    if (!gameStart) return;
    const { changedTouches } = e
    const { clientX, clientY } = changedTouches[0];
    let deltaX = clientX - touchStart.x;
    let deltaY = clientY - touchStart.y;
    let data = {
      action: 'down',
      roomId: props.room.id
    }
    if (Math.abs(deltaX - deltaY) <= 2) deltaX = deltaY;
    if (deltaX === deltaY) {
      data.action = 'dropDown'
      props.gameActions(data)
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        data.action = 'right'
        props.gameActions(data)
      } else {
        data.action = 'left'
        props.gameActions(data)
      }
    } else {
      if (deltaY < 0) {
        data.action = 'rotate'
        props.gameActions(data)
      }
    }
  };

  const handleKeyUp = (e) => {
    if (gameStart && !gamePause && !gameWon && !gameOver) setDailyDrop(500);
  };

  const { room, profile, gameClear, continueGame, leaveRoom } = props;

  useEffect(() => {
    const modal = () => {
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
      modal();
      setDailyDrop(null);
    }
  }, [gameOver, gameWon, room.id, room.admin, profile.id, gameClear, continueGame, leaveRoom]);


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
            onClick={(e) => {
              e.stopPropagation()
              !gameStart &&
                props.changeStatusRoom({
                  roomId: props.room.id,
                  status: "started",
                });
              changeFocused();
            }}
          >
            Start
          </Button>
        )}
        {props.profile.id === props.room.admin && gameStart && !gameOver && !gameWon && (
          <Button
            type="primary"
            disabled={!props.room.admin === props.profile.id}
            onClick={(e) => {
              e.stopPropagation()
              props.changeStatusRoom({
                roomId: props.room.id,
                status: !gamePause ? "paused" : "started",
              });
              changeFocused();
            }}
          >
            {gamePause ? "Resume" : "Pause"}
          </Button>
        )}
        {props.room.isPrivate && (
          <Button
            type="primary"
            hidden={gameStart}
            onClick={(e) => {
              e.stopPropagation()
              props.updateRoomToPublic({ roomId: props.room.id });
            }}
          >
            chnage room to public
          </Button>
        )}
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation()
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
          if (!gameStart || gamePause || gameOver || gameWon) return;
          setDailyDrop(null);
          setTouchStart({
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
          });
        }}
        onTouchEnd={(e) => {
          if (!gameStart || gamePause || gameOver || gameWon) return;
          setDailyDrop(500)
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
          cursor: 'default'
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
              <StageStyled> {CreateStage(userStage)} </StageStyled>
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
