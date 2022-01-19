import React, {useState} from "react";
import { Layout, Menu} from "antd";



import Nabar from "../components/Navbar";
import FooterComponent from "../components/Footer";
import FormUserName from "../components/FormUserName";
import FormRoomName from "../components/FormRoomName";
import RoomPage from "../pages/RoomPage";

import OnePlayerMode from "../pages/OnePlayerMode";
import MultiPlayerMode from "../pages/MultiPlayerMode";

import {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';

import "./styles/HeaderStyled.css";

import { useSelector } from "react-redux";



const { Header, Sider, Content, Footer } = Layout;



const HomePage = () => {
    const [collapsible, setCollapsible] = useState(true);
    const { auth, room } = useSelector(state => state);

    console.log(room);

    return (
        <Layout style={{
            background: "none",
        }}>
        <Header theme="dark" className="header" style={{
            background: 'none',
            padding: 0,
            margin: 0,
            marginBottom: "-15px",
            zIndex: "998",
            }}>
              <Nabar />
          </Header>
        <Layout style={{
            background: 'none',
        }}>
        <Content style={{
            background: 'none',
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 138px)',
            
            }}>
            {!auth.isAuth ?
                     <FormUserName />
                 :!room.is_joined ?
                     <FormRoomName />
                : !room.isPrivate ?
                    <MultiPlayerMode />
                :
                    <OnePlayerMode />
                }
          </Content>
          <span style={{
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
            </span>
          <Sider theme="dark"
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
        </Sider>
        </Layout>
        <Footer style={{
            background: 'none',
            marginTop: '-10px',
            zIndex: "999",
            padding: 0,
        }}>
            <FooterComponent />
        </Footer>
      </Layout>


    );
}

export default HomePage;