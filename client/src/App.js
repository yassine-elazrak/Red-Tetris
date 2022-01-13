import './App.css';



// import Navbar from './components/Navbar';
import FooterContainer from './components/Footer';
import ContentComponent from './components/Content';

import { Container, Navbar, Row, Col } from 'react-bootstrap';

import { NavbarStyled, LogoDesktop, LogoMobile } from './components/styles/HeaderStyled';

import logD from "./img/logo.svg";
import logM from "./img/logoMobile.svg";
// import { Content } from 'antd/lib/layout/layout';

import background from './img/nav-bg.png';

function App() {
  return (
    <div className="App">
        <NavbarStyled className='d-flex justify-content-between'>
        <h1>room name</h1>
            {/* <LogoDesktop> */}
                {/* <img src={logD} alt="logo" className='d-none d-md-block' /> */}
            {/* </LogoDesktop> */}
            {/* <LogoMobile> */}
                <img src={logM} alt="logo" className='d-xs-block d-none' />
            {/* </LogoMobile> */}
            <h1>notif</h1>
        </NavbarStyled>
    </div>
  );
}

export default App;
