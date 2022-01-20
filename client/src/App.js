import React from 'react';

import './App.css';



import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';

import sotre from './sotre';

import { isAuth } from './actions/auth';
import { refreshRoom } from './actions/room';
import { refreshInvite } from './actions/invite';

sotre.dispatch(isAuth());
sotre.dispatch(refreshRoom());
sotre.dispatch(refreshInvite());



function App() {

  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
