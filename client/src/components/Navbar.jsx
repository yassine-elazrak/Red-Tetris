import React, { useState } from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import { NavbarStyled, NotifDiv, LogoDesktop, LogoMobile } from './styles/NavBarStyled';
import { BellOutlined } from '@ant-design/icons';
import { Affix, Menu, Dropdown, Button, Badge} from "antd";

import { green, red } from '@ant-design/colors';
// import { Background } from "./styles/FooterStyled";
// import 'antd/dist/antd.css';

const { SubMenu } = Menu;
// const { Header } = Layout;

const NavbarComponent = () => {

    const isLogin = true;
    const userName = "zaynoune";
    const roomName = "room1";

    const testnotif = [
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: true
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: true
        },
        {
            title: "New message from John Doe",
            time: "3 minutes ago",
            read: false
        },
    ]
    const [notifs, setNotifs] = useState(testnotif);

    const handnotif = (e) => {
        const newNotifs = notifs.map((notif, key) => {
            if (e.key.split("-")[1] === key) {
                notif.read = false;
            }
            return notif;
        });
        setNotifs(newNotifs);
        

        console.log(e.key.split("-")[1]);
    }
    
    const mapnotifs = notifs.map((notif, key) => {
        return (
            !notif.read ?
            <SubMenu key={key} expandIcon title={
                <div style={{ display: "flex", alignItems: "center",}}>
                    <div>
                        <p>{notif.title}</p>
                        <p style={{ fontSize: "12px", color: "#8c8c8c" }}>{notif.time}</p>
                    </div>
                </div>
            }>
                <Menu.Item key={'accept-' + key} onClick={handnotif}
                    style={{
                        backgroundColor: green[5],
                        borderRadius: "5px",
                        // height: "40%",
                        margin: "5px",
                        color: "#fff",

                    }}>
                    Accept
                </Menu.Item>

                <Menu.Item key={'cancel-' + key} style={{
                    backgroundColor: red[5],
                    borderRadius: "5px",
                    // height: "40%",
                    margin: "5px",
                    color: "#fff",
                }}>
                    Cancel
                </Menu.Item>
            </SubMenu>
            :
            <SubMenu key={key} expandIcon disabled title={
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                        <p>{notif.title}</p>
                        <p style={{ fontSize: "12px", color: "#8c8c8c" }}>{notif.time}</p>
                    </div>
                </div>
            }>
            </SubMenu>
        )
    })

    const menu = (
        <Menu mode="vertical" trigger={['click']} >
            {/* <SubMenu key="sub2" title="User x invet you to play a game" expandIcon >
                <Menu.Item key="sub2-2"> <Button type="primary" size="small" >Accept</Button> </Menu.Item>
                <Menu.Item key="sub2-1" > <Button type="danger" size="small" >Cancel</Button> </Menu.Item>
            </SubMenu>
            <SubMenu key="sub1" title="User x invet you to play a game" expandIcon >
                <Menu.Item key="sub1-0"><Button type="primary" size="small" >Accept</Button></Menu.Item>
                <Menu.Item key="sub1-1"><Button type="danger" size="small" >Cancel</Button></Menu.Item>
            </SubMenu> */}
            {mapnotifs}
        </Menu>
    );

    return (
        <Affix>
            <NavbarStyled className='d-flex justify-content-between'>
                {!isLogin ?
                    <div className='d-flex justify-content-around' style={{width: '100%'}} >
                        <img src={logD} alt="logo" />
                    </div>
                    :
                <>    
                    <h3> {roomName ? roomName : userName} </h3>
                    <LogoDesktop>
                        <img src={logD} alt="logo" className='d-none d-md-block' />
                    </LogoDesktop>
                    <LogoMobile>
                        <img src={logM} alt="logo" className='d-none d-sm-block'  />
                    </LogoMobile>
                    <NotifDiv>
                        <h3  className="d-none d-sm-block" > {roomName && userName} </h3>
                        <Dropdown overlay={menu} trigger={['click']} >
                            <div className="ant-dropdown-link" style={{padding: '8px 0px', cursor: 'pointer'}} >
                                <Badge count={notifs.length} showZero className="site-badge-count-109" style={{backgroundColor: "#6FCF97", color: '#fff', margin: 0, padding: 0}} >
                                    <BellOutlined style={{fontSize: 25, margin: 0, padding: 0}} />
                                </Badge>
                            </div>
                        </Dropdown>
                    </NotifDiv>
                    </>
                }
            </NavbarStyled>
        </Affix>
    );
}

export default NavbarComponent;