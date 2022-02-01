import styled from "styled-components";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../helpers/StageHelper";

export const StageStyled = styled.div`
  display: grid;
  grid-template-rows: repeat(${STAGE_HEIGHT}, calc(55vh / ${STAGE_HEIGHT}));
      grid-template-columns: repeat(${STAGE_WIDTH}, calc(40vh / ${STAGE_WIDTH}));
  grid-gap: 1px;
  margin: 0;
  padding: 0;
  justify-content: center;
  
  @media (max-width: 1122px) {
      grid-template-rows: repeat(${STAGE_HEIGHT}, calc(45vw / ${STAGE_HEIGHT}));
      grid-template-columns: repeat(${STAGE_WIDTH}, calc(35vw / ${STAGE_WIDTH}));
    }
    
    @media (max-width: 880px) {
        grid-template-rows: repeat(${STAGE_HEIGHT}, calc(50vh / ${STAGE_HEIGHT}));
        grid-template-columns: repeat(${STAGE_WIDTH}, calc(45vw / ${STAGE_WIDTH}));
  }

  @media (max-width: 768px) {
    grid-template-rows: repeat(${STAGE_HEIGHT}, calc(50vh / ${STAGE_HEIGHT}));
    grid-template-columns: repeat(${STAGE_WIDTH}, calc(47vw / ${STAGE_WIDTH}));
}

  @media (max-width: 425px) {
    grid-template-rows: repeat(${STAGE_HEIGHT}, calc(60vh / ${STAGE_HEIGHT}));
    grid-template-columns: repeat(${STAGE_WIDTH}, calc(80vw / ${STAGE_WIDTH}));
  }

  @media (max-width: 375px) {
    grid-template-rows: repeat(${STAGE_HEIGHT}, calc(50vh / ${STAGE_HEIGHT}));
    grid-template-columns: repeat(${STAGE_WIDTH}, calc(90vw / ${STAGE_WIDTH}));
  }

  @media (max-width: 320px) {
    grid-template-rows: repeat(${STAGE_HEIGHT}, calc(50vh / ${STAGE_HEIGHT}));
    grid-template-columns: repeat(${STAGE_WIDTH}, calc(90vw / ${STAGE_WIDTH}));
  }
`;
