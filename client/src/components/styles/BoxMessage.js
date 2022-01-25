import Item from "antd/lib/list/Item";
import styled from "styled-components";

export const BoxMessage = styled.div`
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px;
    height: calc(100% - 30px);
    ::-webkit-scrollbar {
        width: 10px;
      }
      
      ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey; 
        border-radius: 10px;
      }
       
      ::-webkit-scrollbar-thumb {
        background: grey; 
        border-radius: 10px;
      }
`;

export const MessageContent = styled.div`
    background: rgba(0, 0, 0, 0.5);
    width: 90%;
    padding: 0px 10px 10px 10px;
    float: ${props => props.userId === props.authId ? 'right' : 'left'};
    margin-bottom: 10px;
    border-radius: ${props => props.userId === props.authId ? '10px 0px 10px 10px' :
        '0px 10px 10px 10px'};
`;

export const MessageUserName = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: rgba(225, 225, 225, 0.5);
    text-align: ${props => props.userId === props.authId ? 'end' : 'start'};
`;

export const MessageText = styled.div`
    font-size: 12px;
    color: #ccc;
    text-align: ${props => props.userId === props.authId ? 'end' : 'start'};
    padding-left: 5px;
    padding-right: 5px;
`;

export const MessageCreatedAt = styled.div`
    font-size: 12px;
    color: rgba(225, 225, 225, 0.5);
    text-align: ${props => props.userId === props.authId ? 'start' : 'end'};
`;