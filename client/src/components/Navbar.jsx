import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import { NavbarStyled, LogoDesktop, LogoMobile } from './styles/HeaderStyled';

const Navbar = () => {
    return (
        <NavbarStyled>
            <h1>room name</h1>
            <LogoDesktop>
                <img src={logD} alt="logo" />
            </LogoDesktop>
            <LogoMobile>
                <img src={logM} alt="logo" />
            </LogoMobile>
            <h1>notif</h1>
        </NavbarStyled>
    );
}

export default Navbar;