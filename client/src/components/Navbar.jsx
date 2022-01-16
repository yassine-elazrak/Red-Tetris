import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import NotifComponent from "./Notifications";

import { NavbarStyled, NotifDiv, LogoDesktop, LogoMobile } from './styles/NavBarStyled';
import { Affix } from "antd";


const NavbarComponent = () => {

    const isLogin = true;
    const userName = "zaynoune";
    const roomName = "room1";


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
                        <NotifComponent />
                    </NotifDiv>
                    </>
                }
            </NavbarStyled>
        </Affix>
    );
}

export default NavbarComponent;