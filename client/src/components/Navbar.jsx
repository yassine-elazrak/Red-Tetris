import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import { NavbarStyled, NotifDiv, NotifIcon, LogoDesktop, LogoMobile } from './styles/NavBarStyled';
import { BellOutlined } from '@ant-design/icons';
import { Affix} from "antd";


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
                <NotifDiv>
                    <h3  className="d-none d-sm-block" >user Name</h3>
                    <NotifIcon>
                        <BellOutlined style={{fontSize: 25, margin: 0, padding: 0}} />
                        <div>
                            <span>0</span>
                        </div>
                    </NotifIcon>
                </NotifDiv>
            </NavbarStyled>
        </Affix>
    );
}

export default NavbarComponent;