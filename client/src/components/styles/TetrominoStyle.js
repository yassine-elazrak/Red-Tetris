import styled from "styled-components";

export const TetrominoStyle = styled.div`
    // width: atuo;
    // height: 20px;
    background-color: rgba(${props => props.color},
        ${props => props.type === 0 ? 0.4 : props.type === 'D' ? 1 : 0.8});
    border: ${props => props.type === 0 ? "0px" : "1px solid"};
    border-bottom-color: rgba(${props => props.color}, 0.1);
    border-right-color: rgba(${props => props.color}, 1);
    border-top-color: rgba(${props => props.color}, 1);
    border-left-color: rgba(${props => props.color}, 0.3);
    
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
`;