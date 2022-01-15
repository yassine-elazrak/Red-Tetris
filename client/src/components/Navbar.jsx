import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import { NavbarStyled, NotifDiv, NotifIcon, LogoDesktop, LogoMobile } from './styles/NavBarStyled';
import { BellOutlined } from '@ant-design/icons';
import { green} from '@ant-design/colors';
import { Affix, Menu, Dropdown, Button, Badge} from "antd";
// import { Background } from "./styles/FooterStyled";


const { SubMenu } = Menu;
// const { Header } = Layout;

const NavbarComponent = () => {

    const notif = 100;
    const isLogin = true;
    const userName = "zaynoune";
    const roomName = "";

    const menu = (
        <Menu>
            <SubMenu key="sub2" title="User x invet you to play a game" expandIcon trigger={['click']} >
                <Menu.Item key="sub2-2"> <Button type="primary" size="middle" >Accept</Button> </Menu.Item>
                <Menu.Item key="sub2-1" > <Button type="danger" size="middle" >Cancel</Button> </Menu.Item>
            </SubMenu>
            <SubMenu key="sub1" title="User x invet you to play a game" expandIcon disabled>
                <Menu.Item key="sub1-0">Accepte</Menu.Item>
                <Menu.Item key="sub1-1">Cancel</Menu.Item>
            </SubMenu>
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
                    <h3> {roomName} </h3>
                    <LogoDesktop>
                        <img src={logD} alt="logo" className='d-none d-md-block' />
                    </LogoDesktop>
                    <LogoMobile>
                        <img src={logM} alt="logo" className='d-none d-l-block'  />
                    </LogoMobile>
                    <NotifDiv>
                        <h3  className="d-none d-sm-block" > {userName} </h3>
                        <Dropdown overlay={menu} trigger={['click']} >
                            <div className="ant-dropdown-link" style={{padding: '8px 0px', cursor: 'pointer'}} >
                                <Badge count={notif} showZero className="site-badge-count-109" style={{backgroundColor: green[6], color: '#fff', margin: 0, padding: 0}} >
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