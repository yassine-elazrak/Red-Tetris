import React from 'react';

import './App.css';



import NavbarComponent from './components/Navbar';
import FooterContainer from './components/Footer';
// import ContentComponent from './components/Content';

import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';



function App() {
  return (
    <div className="App">
      <NavbarComponent />
      <HomePage />
      < FooterContainer />
    </div>
  );
}

export default App;
