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
} from "../redux/actions";

import "./styles/HeaderStyled.css";

const { Header, Content, Footer, Sider } = Layout;

const HomePage = (props) => {
  const { auth, room, login, createRoom } = props;
  const [hash, setHash] = useState({
    name: null,
    room: null,
    error: "",
  });
  const [collapsed, setCollapsed] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (props.auth.isAuth && !props.auth.isJoned) {
      setTimeout(() => {
        setTooltipVisible(false);
      }, 3000);
      props.refreshRooms();
    }
    else setCollapsed(true);
  }, [props.auth]);

  useEffect(() => {
    setRooms(props.rooms.rooms);
    // console.log(props.rooms.rooms, "props.rooms.rooms");
  }, [props.rooms.rooms]);

  useEffect(() => {
    if (hash.error) message.error(hash.error);
    else if (hash.name && hash.room) {
      login(hash.name);
      let roomInfo = {
        roomId: 1,
        roomName: hash.room,
        isPravite: false,
        user: hash.name,
        status: "waiting",
      };
      createRoom(roomInfo);
    }
  }, [hash]);

  useEffect(() => {
    if (props.socket.socket) {
      const hashBased = () => {
        const { hash } = window.location;
        if (hash) {
          const Regx = new RegExp(/(^#[\w-]+\[[\w-]+\]$)/g);
          const match = hash.match(Regx);
          if (!match) {
            setHash({
              ...hash,
              error: "Invalid hash-based url",
            });
          } else {
            const split = hash.match(/([\w-]+)/g);
            setHash({
              name: split[1],
              room: split[2],
              error: "",
            });
          }
        }
      };
      hashBased();

      props.socket.socket.socket("/").on("updateProfile", (data) => {
        props.updateUser(data);
      });
      props.socket.socket.socket("/").on("updateRooms", (data) => {
        console.log(data, "dataRooms");
        props.refreshRooms(data);
      });
      // props.socket.socket("/").on("updateRoom", (data) => {
      //   console.log("room update", data);
      // })
      return () => {
        props.socket.socket.socket("/").off("updateProfile");
        props.socket.socket.socket("/").off("updateRooms");
        // props.socket.socket.socket("/").off("updateRoom");
      };
    }
    if (props.socket.error) {
      message.error(props.socket.error);
    }
  }, [props.socket]);

  const handleJoinToRoom = (room) => {
    props.joinRoom(room.id);
    // roomId: data.roomId, userId: socket.id
    // admin: "KzHq7Xd610cL2copAAAH"
    // id: "KzHq7Xd610cL2copAAAH"
    // isPravite: false
    // name: "sadfdas"
    // status: "waiting"
    // const data = (({roomId, userId}) => ({}))(room);
    console.log(room, "room want to join");
  };


  // useEffect(() => {
  //   props.socket.socket("/").on("updateRoom", (data) => {
  //     console.log("update Room", data);
  //   });
  //   props.onlineUsers();

  //   return () => {
  //     props.socket.socket("/").off("updateRoom");
  //   };
  // },[]);

  const menu = () => {
    return (
      <List
        style={{
          background: "transparent",
          color: "white",
          // padding: "5px",
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
                disabled={room.status !== "waiting"}
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
          ) : !auth.isAuth ? (
            <FormUserName />
          ) : !room.name ? (
            <FormRoomName />
          ) : !room.isPravite &&
            room.status === "waiting" &&
            auth.id === room.admin ? (
            <InviteUsers />
          ) : (
            <GameSpace />
          )}
        </Content>
        <Sider
          collapsedWidth="0"
          collapsible
          collapsed={collapsed}
          width="300px"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            height: "100vh",
            marginTop: "-10px",
            paddingTop: "10px",
            breakBefore: "column",
            display: "relative",
            fontSize: "20px",
          }}
        >
          {props.auth.isAuth && !props.auth.isJoned && (
            <div
              style={{
                color: "white",
                position: "absolute",
                left: "-30px",
              }}
            >
              {collapsed ? (
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
              )}
            </div>
          )}
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
    auth: state.auth,
    room: state.room,
    socket: state.socket,
    rooms: state.rooms,
  };
};

export default connect(mapStateToProps, {
  login,
  updateUser,
  createRoom,
  refreshRooms,
  joinRoom,
})(HomePage);
