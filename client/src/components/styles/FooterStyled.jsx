import styled from 'styled-components'

import background from '../../img/footer-bg.png'

export const FooterStyled = styled.footer`
display: flex;
// position: absolute;
// bottom: 0;
justify-content: space-between;
width: 100%;
height: 50px;
background-image: url(${background});
background-size: contain;
background-height: 100%;
background-repeat-y: no-repeat;
z-index: 100;
padding: 0 20px;
margin: 0;

border-bottom: 1px solid green;



    @media (max-width: 768px) {
        height: 50px;
        background-size: contain;
    }
    @media (max-width: 425px) {
        height: 40px;
        // background-position:  0% 15px;
        background-size: cover;
        // background-attachment: fixed;
    }

    @media (max-width: 375px) {
        height: 37px;
        // background-position: center bottom -24px;
        background-size: cover;
    }

    @media (max-width: 320px) {
        height: 35px;
        // background-position: center bottom -21px;
        background-size: cover;
    }
`

export const FooterDiv = styled.div`
    // border : 1px solid blue;
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0px;
    justify-content: space-between;
    z-index: 100;
    align-items: end;

    
`

export const Background = styled.img`
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    padding: 0;
    margin: 0;

    border: 1px solid red;
`