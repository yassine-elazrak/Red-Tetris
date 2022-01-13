import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import { NavbarStyled, LogoDesktop, LogoMobile } from './styles/HeaderStyled';
import { BellOutlined } from '@ant-design/icons';
import { Layout, Affix } from "antd";


const { Header } = Layout;

const Navbar = () => {
    return (
        <Affix>
        <Header>
        <NavbarStyled className='d-flex justify-content-between'>
            <h1> test </h1>
            <LogoDesktop>
                <img src={logD} alt="logo" className='d-none d-md-block' />
            </LogoDesktop>
            <LogoMobile>
                <img src={logM} alt="logo"  />
            </LogoMobile>
                <BellOutlined style={{fontSize: 25}} />
        </NavbarStyled>
        </Header>
        </Affix>
    );
}

export default Navbar;