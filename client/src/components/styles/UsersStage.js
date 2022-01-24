import styled from "styled-components";

export const UsersStage = styled.div`
    width: 100%;
    height: calc(100vh - 162px);
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0;
    margin: auto;

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