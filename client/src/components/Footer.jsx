import React from "react";

// import { footerStyled } from './styles/footerStyled';
import { FooterStyled, FooterDiv } from "./styles/FooterStyled";

const FooterComponet = () => {
  return (
    <FooterStyled>
      <FooterDiv style={{ alignItems: "end", padding: 0, margin: 0 }}>
        <p className="d-none d-md-block" style={{ margin: 0 }}>
          {process.env.REACT_APP_NAME}
        </p>
        <p
          style={{ margin: 0 }}
        >{`©2022 Created by ${process.env.REACT_APP_TEAME}`}</p>
      </FooterDiv>
    </FooterStyled>
  );
};

export default FooterComponet;
