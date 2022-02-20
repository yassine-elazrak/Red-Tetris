import React, { useEffect, useState } from "react";
import { Layout, message, Button, List, Tooltip } from "antd";

import Nabar from "../components/Navbar";
import FooterComponent from "../components/Footer";
import FormUserName from "../components/FormUserName";
import FormRoomName from "../components/FormRoomName";
import Page404 from "./404";

import GameSpace from "../components/GameSpace";
import InviteUsers from "../components/InviteUsers";

import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import { connect } from "react-redux";
import {
  login,
  createRoom,
  updateUser,
  refreshRooms,
  joinRoom,
  createOrJoinRoom,
  refreshRoom,
  clearRoom,
  gameClear,
  updateGame,
  updateAllPlayers,
} from "../redux/actions";

import "./styles/HeaderStyled.css";

const { Header, Content, Footer, Sider } = Layout;

const HomePage = (props) => {
  const { profile, room, refreshRooms, login, createOrJoinRoom } = props;
  const [hashUrl, setHashUrl] = useState({
    name: null,
    room: null,
    error: "",
  });
  const [collapsed, setCollapsed] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [rooms, setRooms] = useState([]);


  useEffect(() => {
    if (profile.isAuth && !profile.isJoined) {
      setTimeout(() => {
        setTooltipVisible(false);
      }, 3000);
      refreshRooms();
    } else setCollapsed(true);
  }, [profile, refreshRooms]);

  useEffect(() => {
    setRooms(props.rooms.rooms);
  }, [props.rooms.rooms]);

  useEffect(() => {
    ////console.log("hash", hash);
    if (hashUrl.error) message.error(hashUrl.error);
    else if (hashUrl.name && hashUrl.room) {
      ////console.log("login by url-hash", hash);
      login(hashUrl.name);
    }
  }, [hashUrl, login]);

  useEffect(() => {
    if (profile.isAuth && !profile.isJoined && !hashUrl.error && hashUrl.room) {
      ////console.log('don1');
      let roomInfo = {
        roomName: hashUrl.room,
        isPravite: false,
        userId: profile.id,
      };
      setHashUrl({
        name: null,
        room: null,
        error: "",
      });
      createOrJoinRoom(roomInfo);
    }
  }, [hashUrl, profile, createOrJoinRoom]);


  const {updateUser, updateGame, updateAllPlayers, gameClear, clearRoom, refreshRoom, socket} = props;
  useEffect(() => {
    //console.log('socket changed');
    if (socket.socket) {
      // MOVE THIS LISTENERS TO GAME SPACE
      socket.socket.socket("/").on("updateProfile", (data) => {
        //console.log("udpate profile", data)
        updateUser(data);
      });
      socket.socket.socket("/").on("updateRooms", (data) => {
        //console.log("update rooms", data);
        refreshRooms(data);
      });
      socket.socket.socket("/").on("updateRoom", (data) => {
        refreshRoom(data);
        //console.log("update Room ============>", data);
      });
      socket.socket.socket('/').on("updateGame", data => {
        //console.log('update Game <<<<<<<<<<>>>>>>>>', data);
        updateGame(data);
      })
      socket.socket.socket('/').on("updateAllPlayers", data => {
        //console.log('all Players ====>', data);
        updateAllPlayers(data)
      })
      socket.socket.socket('/').on("leaveRoom", data => {
        gameClear();
        clearRoom();
        updateUser(data)
      })
      return () => {
        socket.socket.socket("/").off("updateProfile");
        socket.socket.socket("/").off("updateRooms");
        socket.socket.socket("/").off("updateRoom");
        socket.socket.socket("/").off("leaveRoom");
        socket.socket.socket("/").off("updateGame");
        socket.socket.socket("/").off("updateAllPlayers");
      };
    }
    if (socket.error) {
      message.error(socket.error);
    }
  }, [socket, updateUser, updateGame, updateAllPlayers, gameClear, clearRoom, refreshRoom, refreshRooms]);

  useEffect(() => {
    const hashBased = () => {
      const { hash } = window.location;
      if (hash && !profile.isAuth) {
        const Regx = new RegExp(/(^#[\w-]+\[[\w-]+\]$)/g);
        const match = hash.match(Regx);
        ////console.log("match", match);
        if (!match) {
          setHashUrl({
            error: "Invalid hash-based url",
          });
        } else {
          const split = hash.match(/([\w-]+)/g);
          ////console.log("split", split);
          setHashUrl({
            room: split[0],
            name: split[1],
            error: "",
          });
        }
        // window.location.hash = "";
      }
    };

    !profile.isAuth && hashBased();
  }, [profile.isAuth]);

  const handleJoinToRoom = (room) => {
    props.joinRoom(room.id);
    ////console.log(room, "room want to join");
  };

  const menu = () => {
    return (
      <List
        style={{
          background: "transparent",
          color: "white",
        }}
      >
        {rooms.map((room, key) => {
          return (
            <List.Item
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background:
                  key % 2 === 0
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(255, 255, 255, 0.1)",
                padding: "10px",
                margin: 0,
                border: "none",
              }}
            >
              <span>{room.name}</span>
              <span>{room.status}</span>
              <Button
                type="primary"
                disabled={room.status !== "waiting" && room.status !== 'end'}
                onClick={() => handleJoinToRoom(room)}
              >
                join
              </Button>
            </List.Item>
          );
        })}
      </List>
    );
  };

  return (
    <Layout
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        width: "100vw",
        height: "100vh",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    >
      <Header
        theme="dark"
        className="header"
        style={{
          background: "none",
          padding: 0,
          margin: 0,
          zIndex: "998",
        }}
      >
        <Nabar />
      </Header>
      <Layout
        style={{
          background: "none",
        }}
      >
        <Content
          style={{
            background: "none",
            minHeight: "calc(100vh - 115px)",
          }}
        >
          {window.location.pathname !== "/" ? (
            <Page404 />
          ) : !profile.isAuth ? (
            <FormUserName />
          ) : !room.name ? (
            <FormRoomName />
          ) : !room.isPravite &&
            (room.status === "waiting" || (props.game.status === 'continue' && room.status === 'end')) &&
            profile.id === room.admin ? (
            <InviteUsers />
            // <GameSpace />
          ) : (
            <GameSpace />
          )}
        </Content>
        <Sider
          collapsedWidth={0}
          collapsible
          collapsed={collapsed}
          reverseArrow={true}
          // breakpoint="lg"
          trigger={
            props.profile.isAuth && !props.profile.isJoined ? (
              collapsed ? (
                <Tooltip
                  title="Current Rooms"
                  placement="right"
                  defaultVisible={true}
                  mouseEnterDelay={1}
                  visible={tooltipVisible}
                >
                  <MenuFoldOutlined onClick={() => setCollapsed(false)} />
                </Tooltip>
              ) : (
                <MenuUnfoldOutlined onClick={() => setCollapsed(true)} />
              )) : (null)
          }
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          width="300px"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            height: "100vh",
            marginTop: "-10px",
            paddingTop: "10px",
            fontSize: "20px",
          }}
        >
          <div
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "20px",
              width: "100%",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            Current Rooms
          </div>
          {menu()}
        </Sider>
      </Layout>
      <Footer
        style={{
          background: "none",
          zIndex: "999",
          padding: 0,
        }}
      >
        <FooterComponent />
      </Footer>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    room: state.room,
    socket: state.socket,
    rooms: state.rooms,
    game: state.game
  };
};

export default connect(mapStateToProps, {
  login,
  updateUser,
  createRoom,
  refreshRooms,
  joinRoom,
  createOrJoinRoom,
  refreshRoom,
  clearRoom,
  gameClear,
  updateGame,
  updateAllPlayers,
})(HomePage);
