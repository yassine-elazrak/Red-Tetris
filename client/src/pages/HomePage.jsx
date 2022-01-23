import React, {useState, useEffect} from "react";
import { Layout, Menu, message} from "antd";



import Nabar from "../components/Navbar";
import FooterComponent from "../components/Footer";
import FormUserName from "../components/FormUserName";
import FormRoomName from "../components/FormRoomName";
import RoomPage from "./RoomPage";
import Page404 from "./404";

import OnePlayerMode from "../pages/OnePlayerMode";
import MultiPlayerMode from "../pages/MultiPlayerMode";

import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import { connect } from "react-redux";
import { login, createRoom } from "../redux/actions";

import "./styles/HeaderStyled.css";

import { useSelector, useDispatch } from "react-redux";



const { Header, Sider, Content, Footer } = Layout;



const HomePage = (props) => {
    const [collapsible, setCollapsible] = useState(true);
    const { auth, room } = props;

    const user = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const { hash } = window.location;
        if (hash){
            const Regx = /(^#[\w\-]+\[[\w\-]+\]$)/g
            const match = hash.match(Regx);
            console.log(hash, hash.match(Regx) );
            console.log(props);
            if (!match){
                message.error(`Invalid hash-basd url`)
            } else {
                const split = hash.match(/([\w\-]+)/g)
                dispatch(login(split[1]));
                console.log(user, 'user');
                const roomData = {
                  roomId: 1,
                  roomName: split[0],
                  isPravite: true,
                  user: props.auth,
                }
                dispatch(createRoom(roomData));
            }
        }
        
    }, [])



    return (
        <Layout style={{
            background: "none",
            width: "100vw",
            height: "auto",
            // border: "1px solid green",
        }}>
        <Header theme="dark" className="header" style={{
            background: 'none',
            padding: 0,
            margin: 0,
            // marginBottom: "-15px",
            zIndex: "998",
            }}>
              <Nabar />
          </Header>
        <Layout style={{
            background: 'none',
        }}>
        <Content style={{
            background: 'none',
            // marginTop: "24px",
            // margin: '24px 16px',
            // padding: 24,
            minHeight: 'calc(100vh - 115px)',
            
            }}>
            {window.location.pathname !== '/' ?
                  <Page404 />
                  :!auth.isAuth ?
                     <FormUserName />
                 :!room.is_joined ?
                     <FormRoomName />
                : !room.isPravite ? room.status === "waiting" ?
                      <MultiPlayerMode />
                      : <RoomPage />
                :
                    <OnePlayerMode />
                }
          </Content>
          {/* <span style={{
                color: "#404040",
                fontSize: "20px",
                fontWeight: "bold",
                marginRight: "5px",
                marginTop: "8px",
                padding: 0,
                height: "50px",
            }}>
            {!collapsible ?
                <MenuUnfoldOutlined
                    className="trigger"
                    onClick={() => setCollapsible(!collapsible)}
                />
            :
                <MenuFoldOutlined
                    className="trigger"
                    onClick={() => setCollapsible(!collapsible)}
                />
            }
            </span> */}
          {/* <Sider theme="dark"
          trigger={null}
          collapsible
          collapsed={collapsible}
          breakpoint={
            "lg"
          }
            collapsedWidth={0}
          style={{
              background: '#404040',
              margin: 0,
              position: "absolute",
              top: "97px",
              right: "0px",
              height: "calc(100vh - 97px)",
            }}
        >

          <Menu theme="dark" mode="inline" style={{
            background: '#404040',
          }}>
            <Menu.Item key="1">
                <UserOutlined />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider> */}
        </Layout>
        <Footer style={{
            background: 'none',
            // marginTop: '-10px',
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