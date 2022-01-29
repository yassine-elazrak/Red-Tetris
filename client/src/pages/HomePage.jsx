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
            isPravite: true,
            user: props.auth,
            status: 'waiting',
          }
          props.createRoom(roomData);
        }
      }
    };
    hashBased();
  }, []);




  return (
    <Layout style={{
      background: "none",
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
        {/* {showSider &&
          <Sider theme="dark"
            trigger={null}
            // collapsible
            collapsed={collapsed}
            breakpoint={
              "sm"
            }
            collapsedWidth={25}
            // sm={0} md={0}
            style={{
              background: '#404040',
              position: "absolute",
              top: "50px",
              right: "0px",
              height: "calc(100vh - 90px)",
              padding: 0,
            }}
          >
            <div style={{
              height: "100%",
              display: "grid",
              gridTemplateColumns: "25px auto",

            }}>
              <div style={{
                height: "100%",
              }} >
                <h4 style={{
                  height: '25px',
                  width: 'calc(100vh - 90px)',
                  position: "relative",
                  right: -26,
                  textAlign: "center",
                  // top: "",
                  letterSpacing: "10px",
                  fontWeight: "bold",
                  transformOrigin: "0 0",
                  transform: "rotate(90deg)",
                  cursor: "pointer",
                }}
                onClick={() => setCollapsed(!collapsed)}
                >
                  {siderName}
                </h4>
              </div>

              <Menu theme="dark" style={{
                height: "100%",
                background: "none",
                margin: 0,
                padding: 0,

              }}>
                {siderContent}
              </Menu>
            </div> 
              </Sider> 
        }*/}
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