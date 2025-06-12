import React, { useState } from 'react';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup1 from './components/Signup1';
import Signup2 from './components/Signup2';

function App() {
  const [screen, setScreen] = useState('landing');

  let content;
  if (screen === 'landing') content = <Landing />;
  else if (screen === 'login') content = <Login />;
  else if (screen === 'signup1') content = <Signup1 />;
  else if (screen === 'signup2') content = <Signup2 />;

  return (
    <div className="App">
      <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
        <button onClick={() => setScreen('landing')}>Landing</button>
        <button onClick={() => setScreen('login')}>Login</button>
        <button onClick={() => setScreen('signup1')}>Signup1</button>
        <button onClick={() => setScreen('signup2')}>Signup2</button>
      </div>
      {content}
    </div>
  );
}

export default App; 