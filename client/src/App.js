import React from 'react';

import { Routes, Route } from 'react-router-dom';

// Home page component
import HomePage from './pages/HomePage';
import Page404 from './pages/404';

// Style
import 'antd/dist/antd.css';
import './App.css';


function App() {

  return (
    <div className="App">
      <HomePage />
      {/* <Routes>
        <Route path="*"  element={<HomePage />} />
      </Routes> */}
    </div>
  );
}

export default App;
