import React from 'react';
import './App.css';

function App() {
  return (
    <main>
      <h1>CertLogic Fiddle</h1>
      <div>
        <label for="expr">CertLogic expression:</label>
        <textarea id="expr" />
        <label for="data">Data</label>
        <textarea id="data" />
      </div>
      <textarea></textarea>
    </main>
  );
}

export default App;

