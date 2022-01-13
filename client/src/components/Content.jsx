import React from "react";
import { Layout } from "antd";


import { ContentStyled } from "./styles/ContentStyled";

const { Content } = Layout;

const ContentComponent = () => {
    return (
        <ContentStyled>
        <Content style={{ padding: "0 50px" }}>
            {/* <div style={{ border: 1, padding: 24, minHeight: 280 }}>Content</div> */}
        </Content>
         </ContentStyled>
    );
};

export default ContentComponent;