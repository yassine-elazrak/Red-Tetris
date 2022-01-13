import React from 'react';

import './App.css';



import Navbar from './components/Navbar';
import FooterContainer from './components/Footer';
import ContentComponent from './components/Content';

// import { Container, Navbar, Row, Col } from 'react-bootstrap';

import { NavbarStyled, LogoDesktop, LogoMobile } from './components/styles/HeaderStyled';

import logD from "./img/logo.svg";
import logM from "./img/logoMobile.svg";
// import { Content } from 'antd/lib/layout/layout';

// import background from './img/nav-bg.png';

function App() {
  return (
    <div className="App">
      <Navbar />
      <ContentComponent />
      < FooterContainer />
    </div>
  );
}

export default App;
