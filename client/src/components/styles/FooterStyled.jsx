import styled from 'styled-components'

import background from '../../img/footer-bg.png'

export const FooterStyled = styled.footer`
    background-image: url(${background});
    background-size: contain;
    background-repeat-y: no-repeat;
    z-index: 100;
    padding: 15px 20px;
    margin-bottom: -3px;
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

    // border: 1px solid red;
`