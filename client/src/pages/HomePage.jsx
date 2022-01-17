import React from "react";
import { Layout} from "antd";


import { HomeStyled } from "./styles/HomeStyle";
import FormUserName from "../components/FormUserName";
import FormRoomName from "../components/FormRoomName";

import { connect } from "react-redux";
import { login, isAuth } from "../actions/auth";
import store from "../sotre";

store.dispatch(isAuth());

const { Content } = Layout;



const HomePage = (props) => {

    // console.log(props);
    return (
        <HomeStyled>
            <Content style={{ minHeight: "calc(100vh - 98px)"}}>
                {!props.isAuth ?
                    <FormUserName />
                :
                    <FormRoomName />
                }
            </Content>
        </HomeStyled>
    );
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
    }
}

const Home = connect(mapStateToProps)(HomePage);

export default Home;