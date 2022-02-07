import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";

import Nabar from "../components/Navbar";
import FooterComponent from "../components/Footer";
import FormUserName from "../components/FormUserName";
import FormRoomName from "../components/FormRoomName";
import Page404 from "./404";

import GameSpace from "../components/GameSpace";
import InviteUsers from "../components/InviteUsers";

import { connect } from "react-redux";
import { login, createRoom } from "../redux/actions";

import "./styles/HeaderStyled.css";

const { Header, Content, Footer } = Layout;

const HomePage = (props) => {
  const { auth, room, login, createRoom} = props;
  const [hash, setHash] = useState({
    name: null,
    room: null,
    error: "",
  });

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
    if (props.socket.isConnected) {
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
    } else if (props.socket.error) {
      // console.log(props.socket.error, "socket error");
      message.error(props.socket.error);
    }
  }, [props.socket]);

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
          ) : !room.isPravite && room.status === "waiting"
             && auth.id === room.admin? (
            <InviteUsers />
          ) : (
            <GameSpace />
          )}
        </Content>
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
  };
};

export default connect(mapStateToProps, {
  login,
  createRoom,
})(HomePage);
