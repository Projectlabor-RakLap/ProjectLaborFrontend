import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './app/Home/page';
import Warehouses from './app/Warehouses/page';
import Admin from './app/Admin/page';
import Statistics from './app/Statistics/page';
import Profile from './app/Profile/page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/warehouse" element={<Warehouses />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </Router>
  );
}

export default App;
