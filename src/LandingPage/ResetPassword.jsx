import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { RuxInput, RuxButton } from '@astrouxds/react';
import '../css/ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
        token,
        password
      });
      setMessage(response.data.message);
      setTimeout(() => navigate('/signin'), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <RuxInput
          type="password"
          label="New Password"
          required
          value={password}
          onRuxinput={(e) => setPassword(e.target.value)}
        />
        <RuxInput
          type="password"
          label="Confirm New Password"
          required
          value={confirmPassword}
          onRuxinput={(e) => setConfirmPassword(e.target.value)}
        />
        <RuxButton type="submit">Reset Password</RuxButton>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
