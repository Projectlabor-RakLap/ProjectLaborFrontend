import React from 'react';
import logo from 'C:\\Users\\Márk\\Desktop\\Egyetem\\5_felev\\ProjectLaborFrontend\\src\\logo.svg';
import 'C:\\Users\\Márk\\Desktop\\Egyetem\\5_felev\\ProjectLaborFrontend\\src\\App.css';

function Test() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Étít <code>src/App.tsx</code> and save to reload.
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
  );
}

export default Test;
