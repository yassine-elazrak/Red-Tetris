import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import { NavbarStyled, NotifIcon, LogoDesktop, LogoMobile } from './styles/HeaderStyled';
import { BellOutlined } from '@ant-design/icons';
import { Affix } from "antd";


// const { Header } = Layout;

const NavbarComponent = () => {
    return (
        <Affix>
        <NavbarStyled className='d-flex justify-content-between'>
            <h3> room Name </h3>
            <LogoDesktop>
                <img src={logD} alt="logo" className='d-none d-md-block' />
            </LogoDesktop>
            <LogoMobile>
                <img src={logM} alt="logo"  />
            </LogoMobile>
            <NotifIcon>
                <h3  className="d-none d-sm-block" >user Name</h3>
                <BellOutlined style={{fontSize: 25, margin: 0, padding: 0}} />
                <div>
                    <p>1</p>
                </div>
            </NotifIcon>
        </NavbarStyled>
        </Affix>
    );
}

export default NavbarComponent;