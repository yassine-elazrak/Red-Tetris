import React from "react"

// import { footerStyled } from './styles/footerStyled';
import {FooterStyled, FooterDiv, Background} from './styles/FooterStyled';

import { Layout, Col, Row } from 'antd';
import { Card, ListGroupItem, ListGroup } from "react-bootstrap";

// import 'bootstrap/dist/css/bootstrap.min.css';

// import 'antd/dist/antd.css';


const { Header, Content, Sider, Footer } = Layout;


const FooterComponet = () => {
    return (
        // <FooterStyled>
        //     {/* <Footer> */}
        //         <FooterDiv style={{alignItems: 'end', padding: '4px 0', margin:0}}>
        //             <p style={{margin:0}} xs={0} >Read Tetris</p>
        //             <p  style={{margin:0}}>©2022 Created by Alzaynou</p>
        //         </FooterDiv>
        // </FooterStyled>

        <Card body>This is some text within a card body.</Card>
            
    );
}

export default FooterComponet;