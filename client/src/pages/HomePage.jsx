import React from "react";
import { Layout} from "antd";


import { HomeStyled } from "./styles/HomeStyle";
import FormUserName from "../components/FormUserName";
import FormRoomName from "../components/FormRoomName";
import RoomPage from "../pages/RoomPage";

import { connect } from "react-redux";
import { isAuth } from "../actions/auth";
import store from "../sotre";

store.dispatch(isAuth());

const { Content } = Layout;



const HomePage = (props) => {
    return (
        <HomeStyled>
            <Content style={{ minHeight: "calc(100vh - 98px)"}}>
                {!props.user.isAuth ?
                    <FormUserName />
                :!props.room.is_joined ?
                    <FormRoomName />
                : <RoomPage />
                }
            </Content>
        </HomeStyled>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth,
        room: state.room,
        
    }
}

const Home = connect(mapStateToProps)(HomePage);

export default Home;