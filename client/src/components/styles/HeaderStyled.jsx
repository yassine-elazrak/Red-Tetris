import styled from 'styled-components'

import background from '../../img/nav-bg.png'

export const NavbarStyled = styled.nav`
    background-image: url(${background});
    background-size: contain;
    background-repeat-y: no-repeat;
    z-index: 100;
    padding: 0 20px;
    align-items: center;
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

export const NotifIcon = styled.div`
    // border : 1px solid red;
    display: flex;
    padding: 8px 0px;
    // margin: 0;
    // height: 100%;
    // width: 100%;
    justify-content: space-between;
    align-items: top;

    div {
        font-family: 'Source Code Pro', monospace !important;
        display: flex;
        position: relative;
        top: 0;
        left: -10px;
        justify-content: center;
        align-items: center;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #2D9CDB;

        p {
            display: inline-block;
            font-size: 12px;
            color: #EB5757;
            font-weight: bold;
            margin: 0;
            padding: 0;
            font-family: 'Source Code Pro', monospace;
            // background-color: green;
            // border-radius: 50%;
            // width: 10px;
            // height: 10px;
        }
    }

`

export const LogoDesktop = styled.div`
    @media (max-width: 768px) {
        display: none;
    }
`

export const LogoMobile = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: block;
    }
    @media (max-width: 425px) {
        display: none;
    }
`