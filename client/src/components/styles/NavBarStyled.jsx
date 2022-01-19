import styled from 'styled-components'

import background from '../../img/header.png'

export const NavbarStyled = styled.nav`
    background-image: url(${background});
    background-size: contain;
    background-repeat-y: no-repeat;
    // width: 100%;
    height: 64px;
    z-index: 100;
    padding: 0px 20px;
    margin: 0;
    align-items: center;
    * {
        color: #666;
    }
    @media (max-width: 768px) {
        background-size: contain;
    }
    @media (max-width: 425px) {
        background-size: cover;
    }

    @media (max-width: 375px) {
        background-size: cover;
    }
    @media (max-width: 320px) {
        background-size: cover;
    }

`

export const NotifDiv = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin: 0;
    
`

export const NotifIcon = styled.div`
    // border : 1px solid red;
    // display: flex;
    // position: relative;
    padding: 8px 0px;
    // margin: 0;
    // height: 100%;
    // width: 100%;
    // justify-content: space-between;
    // align-items: top;
    cursor: pointer;
    // color: #666;

`

export const LogoDesktop = styled.div`
    cursor: pointer;
    @media (max-width: 768px) {
        display: none;
    }
`

export const LogoMobile = styled.div`
    display: none;
    cursor: pointer;
    @media (max-width: 768px) {
        display: block;
    }
    @media (max-width: 425px) {
        display: none;
    }
`