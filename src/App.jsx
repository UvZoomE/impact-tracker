import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Credentials from "./LandingPage/Credentials";
import CompleteProfile from "./CompleteProfile";
import Home from "./Home";
import Leaderboard from "./Leaderboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Credentials />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
