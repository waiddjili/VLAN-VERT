import React from 'react';
import './App.css';
import VlanManager from './components/VlanManager';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>GNS3 VLAN Manager</h1>
      </header>
      <main>
        <VlanManager />
      </main>
    </div>
  );
}

export default App;

