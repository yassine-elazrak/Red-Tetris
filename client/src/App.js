import React from 'react';

import './App.css';



import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';

import sotre from './sotre';

import { isAuth } from './actions/auth';
import { refreshRoom } from './actions/room';

sotre.dispatch(isAuth());
sotre.dispatch(refreshRoom());



function App() {

  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
