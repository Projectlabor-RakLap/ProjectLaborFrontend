import React from 'react';
import logo from './logo.svg';
import Test from './app/test/page';
import Test2 from './app/test2/page';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
          }
        />
        <Route path="/test" element={<Test/>} />
        <Route path="/test2" element={<Test2/>} />
      </Routes>
    </Router>
  );
}

export default App;
