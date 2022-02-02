import React, { useEffect } from "react";
import { Layout, message, Menu } from "antd";



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

// import { useSelecto } from "react-redux";

// import { useSider } from "../hooks/SiderBar";



const { Header, Content, Footer } = Layout;




const HomePage = (props) => {



  const { auth, room } = props;



  useEffect(() => {
    const hashBased = () => {
      const { hash } = window.location;
      if (hash) {
        const Regx = new RegExp(/(^#[\w-]+\[[\w-]+\]$)/g);
        const match = hash.match(Regx);
        if (!match) {
          message.error(`Invalid hash-basd url`)
        } else {
          const split = hash.match(/([\w-]+)/g)
          props.login(split[1]);
          const roomData = {
            roomId: 1,
            roomName: split[0],
            isPravite: false,
            user: props.auth,
            status: 'waiting',
          }
          props.createRoom(roomData);
        }
      }
    };
    hashBased();
  }, []);


  // useEffect(() => {
  //   console.log('room', room);
  //   if (room.is_joined)
  //   window.location.hash = `#${room.name}[${auth.name}]`;
  // } , [room.is_joined]);




  return (
    <Layout style={{
      // background: "none",
      background: "rgba(0, 0, 0, 0.6)",
      width: "100vw",
      height: "100vh",
      padding: 0,
      margin: 0,
      overflow: "hidden",
    }}>
      <Header theme="dark" className="header" style={{
        background: 'none',
        padding: 0,
        margin: 0,
        zIndex: "998",
      }}>
        <Nabar />
      </Header>
      <Layout style={{
        background: 'none',
      }}>
        <Content style={{
          background: 'none',
          minHeight: 'calc(100vh - 115px)',
        }}>
          {window.location.pathname !== '/' ?
            <Page404 />
            : !auth.isAuth ? <FormUserName /> : !room.is_joined ?
              <FormRoomName />
              // : !room.isPravite && room.status === "waiting" ?
              //   <InviteUsers />
                : <GameSpace />
          }
        </Content>
      </Layout>
      <Footer style={{
        background: 'none',
        zIndex: "999",
        padding: 0,
      }}>
        <FooterComponent />
      </Footer>
    </Layout>


  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    room: state.room,
  };
};

export default connect(mapStateToProps, { login, createRoom })(HomePage);