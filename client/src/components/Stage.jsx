import React from "react";

import { CreateStage } from "../helpers/StageHelper";

import { StageStyled } from "./styles/StageStyled";

const Stage = (props) => {
  // ////console.log('Stage');
  return <StageStyled>{CreateStage(props.stage)}</StageStyled>;
};

export default Stage;
