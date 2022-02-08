import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import NotifComponent from "./Notifications";

import { NavbarStyled, NotifDiv, LogoDesktop, LogoMobile } from './styles/NavBarStyled';
import { Affix, Dropdown, Menu } from "antd";

import { connect } from "react-redux";
// actions
// import {
//     leaveRoom,
//     removeAllInvetes,
// } from '../redux/actions'

const NavbarComponent = (props) => {

    const { auth, room } = props;

    return (
        <Affix>
            <NavbarStyled className='d-flex justify-content-between'>
                {!auth.isAuth ?
                    <div className='d-flex justify-content-around' style={{width: '100%'}} >
                        <img src={logD} alt="logo" />
                    </div>
                    :
                <>    
                    
                    <h3> {room.name} </h3>
                    <LogoDesktop>
                        <img src={logD} alt="logo" className='d-none d-md-block' />
                    </LogoDesktop>
                    <LogoMobile>
                        <img src={logM} alt="logo" className='d-none d-sm-block'  />
                    </LogoMobile>
                    <NotifDiv>
                        <h3  className="d-none d-sm-block" > {auth.name} </h3>
                        <NotifComponent />
                    </NotifDiv>
                    </>
                }
            </NavbarStyled>
        </Affix>
    );
}

const mapStateToProps = (state) => {
    return {
        room: state.room,
        auth: state.auth
    }
}

export default connect(mapStateToProps, {
    // leaveRoom,
    // removeAllInvetes
})(NavbarComponent);