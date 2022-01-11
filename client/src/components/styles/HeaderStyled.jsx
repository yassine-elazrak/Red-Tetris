import styled from 'styled-components'

import img from '../../img/nav-bg.svg'

export const NavbarStyled = styled.div`
    width: 100%;
    height: 100px;
    background-image: url(${img});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
`;