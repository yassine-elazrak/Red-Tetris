import React from "react"

// import { footerStyled } from './styles/footerStyled';
import {FooterStyled, FooterDiv} from './styles/FooterStyled';


const FooterComponet = () => {
    return (
        <FooterStyled>
                <FooterDiv style={{alignItems: 'end', padding: 0, margin:0}}>
                    <p className="d-none d-md-block" style={{margin:0}} >Red Tetris</p>
                    <p  style={{margin:0}}>©2022 Created by Alzaynou</p>
                </FooterDiv>
        </FooterStyled>
            
    );
}

export default FooterComponet;