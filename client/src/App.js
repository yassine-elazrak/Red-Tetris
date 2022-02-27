import React from 'react';
import HomePage from './pages/HomePage';
import NotFound from './pages/404'
import { Routes, Route } from 'react-router-dom'
import 'antd/dist/antd.css';
import './App.css';



function App() {

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
