import React from 'react';

import './App.css';



import NavbarComponent from './components/Navbar';
import FooterContainer from './components/Footer';
// import ContentComponent from './components/Content';

import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';

import { connect } from 'react-redux';

// import sotre from './sotre';

// import { isAuth } from './actions/auth';

// sotre.dispatch(isAuth());



function App(props) {

  return (
    <div className="App">
      {/* <NavbarComponent /> */}
      <HomePage />
      {/* < FooterContainer /> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
    user: state.auth.user,
  }
}

const isLogin = connect(mapStateToProps)(App);

export default isLogin;
