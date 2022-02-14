import React, { useEffect } from "react";
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

    const { profile, room } = props;

    // useEffect(() => {
    //     //console.log("props updatedwww");
    //     if (props.socket){
    //         props.socket.socket("/").on("updateProfile", (data) => {
    //             //console.log(data, "updateProfile");
    //         });
    //         return () => {
    //             props.socket.socket("/").off("updateUsers");
    //         }
    //     }
    // }, [props.socket, props.room, props.profile]);



    return (
        <Affix>
            <NavbarStyled className='d-flex justify-content-between'>
                {!profile.isAuth ?
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
                        <h3  className="d-none d-sm-block" > {profile.name} </h3>
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
    // leaveRoom,
    // removeAllInvetes
})(NavbarComponent);