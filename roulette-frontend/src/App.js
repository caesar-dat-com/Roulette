// roulette-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home         from './pages/Home';
import Login        from './pages/Login';
import SignUp       from './pages/SignUp';
import Dashboard    from './pages/Dashboard';
import RouletteGame from './pages/RouletteGame';
import Stats        from './pages/Stats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/signup"     element={<SignUp />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/game"       element={<RouletteGame />} />
        <Route path="/stats"      element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;
