import React from "react";
import logD from "../img/logo.svg";
import logM from "../img/logoMobile.svg";

import NotifComponent from "./Notifications";

import { NavbarStyled, NotifDiv, LogoDesktop, LogoMobile } from './styles/NavBarStyled';
import { Affix } from "antd";

import { connect } from "react-redux";

const NavbarComponent = (props) => {

    const { profile, room } = props;

    return (
        <Affix>
            <NavbarStyled className='d-flex justify-content-between'>
                {!profile.isAuth ?
                    <div className='d-flex justify-content-around' style={{ width: '100%' }} >
                        <a href="/">
                            <img src={logD} alt="logo" />
                        </a>
                    </div>
                    :
                    <>

                        <h3> {room.name} </h3>
                        <a href="/">
                            <LogoDesktop>
                                <img src={logD} alt="logo" className='d-none d-md-block' />
                            </LogoDesktop>
                            <LogoMobile>
                                <img src={logM} alt="logo" className='d-none d-sm-block' />
                            </LogoMobile>
                        </a>
                        <NotifDiv>
                            <h3 className="d-none d-sm-block" > {profile.name} </h3>
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
        profile: state.profile,
        socket: state.socket.socket,
    }
}

export default connect(mapStateToProps, {
})(NavbarComponent);