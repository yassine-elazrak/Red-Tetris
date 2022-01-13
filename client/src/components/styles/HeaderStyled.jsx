import styled from 'styled-components'

import background from '../../img/nav-bg.png'

export const NavbarStyled = styled.nav`
    background-image: url(${background});
    background-size: contain;
    background-repeat-y: no-repeat;
    z-index: 100;
    padding: 0 20px;
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

`;

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