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
      <Routes>
        <Route path="/"  element={<HomePage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
