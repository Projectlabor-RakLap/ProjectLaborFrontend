import React from 'react';
import logo from '../../logo.svg';
import '../../App.css';
import PillNavFull from '../../Components/NavBar/PillNav/PillNavWithItems';
import MagicBento from '../../Components/MagicBento/MagicBento';


function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <PillNavFull/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <div>
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="132, 0, 255"
          />
        </div>
      </header>
    </div>
  );
}

export default Home;
