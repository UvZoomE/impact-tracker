import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Credentials from "./LandingPage/Credentials";
import CompleteProfile from "./CompleteProfile";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Credentials />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
