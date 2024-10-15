import React, { useState } from "react";
import axios from "axios";
import "../css/SignIn.css";
import { useNavigate } from "react-router-dom";
import { RuxButton, RuxInput } from "@astrouxds/react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (import.meta.env.MODE === 'development') {
        console.log('Login bypassed for development');
        navigate('/home');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, { email, password });
      if (response.data.token) {
        console.log('Login successful');
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      } else {
        console.log('Unexpected response:', response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error('Login error:', error.response.data.message);
        // Handle specific error cases
        if (error.response.status === 403) {
          console.log('Email not verified. Check your email for verification link.');
        } else if (error.response.status === 302) {
          // Redirect to complete profile
          navigate('/complete-profile', { state: { token: error.response.data.token } });
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`, { email: forgotPasswordEmail });
      setResetMessage(response.data.message);
    } catch (error) {
      console.error('Forgot password error:', error);
      setResetMessage(error.response?.data?.message || "Error sending reset email. Please try again.");
      if (error.response?.data?.error) {
        console.error('Detailed error:', error.response.data.error);
      }
    }
  };

  return (
    <div className="sign-in-container">
      {!showForgotPassword ? (
        <form className="rux-form" onSubmit={handleSubmit}>
          <div className="sign-in-inputs">
            <RuxInput
              type="email"
              label="Email"
              placeholder="Email@astro.com"
              required
              value={email}
              onRuxinput={(e) => setEmail(e.target.value)}
            />
            <RuxInput
              type="password"
              label="Password"
              placeholder="Password"
              required
              value={password}
              onRuxinput={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="sign-in-helpers">
            <RuxButton 
              secondary 
              size="small" 
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </RuxButton>
          </div>
          <div className="sign-in-btn-box">
            <RuxButton type="submit">Sign in</RuxButton>
          </div>
        </form>
      ) : (
        <div className="forgot-password-form">
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPassword}>
            <RuxInput
              type="email"
              label="Email"
              required
              value={forgotPasswordEmail}
              onRuxinput={(e) => setForgotPasswordEmail(e.target.value)}
            />
            <RuxButton type="submit">Reset Password</RuxButton>
          </form>
          {resetMessage && <p className="reset-message">{resetMessage}</p>}
          <RuxButton 
            secondary 
            size="small" 
            onClick={() => setShowForgotPassword(false)}
          >
            Back to Sign In
          </RuxButton>
        </div>
      )}
    </div>
  );
};

export default SignIn;
