import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Credentials from "./LandingPage/Credentials";
import CompleteProfile from "./CompleteProfile";
import Home from "./Home";
import ErrorBoundary from './ErrorBoundary';
import SignIn from './LandingPage/SignIn';
import Dashboard from './Dashboard';
import ResetPassword from './LandingPage/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Credentials />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
