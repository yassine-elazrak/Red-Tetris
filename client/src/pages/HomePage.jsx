import React from "react";
import { Layout} from "antd";


import { HomeStyled } from "./styles/HomeStyle";
import FormUserName from "../components/FormUserName";



const { Content } = Layout;



const HomePage = () => {


    return (
        <HomeStyled>
            <Content style={{ minHeight: "calc(100vh - 98px)"}}>
                <FormUserName />
            </Content>
        </HomeStyled>
    );
}

export default HomePage;