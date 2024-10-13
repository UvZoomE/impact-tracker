import axios from "axios";
import "../css/SignIn.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email,
          password,
        },
      );

      if (response.status === 200) {
        // If successful login, redirect to home
        const { token } = response.data;
        // Save token in local storage or context
        localStorage.setItem("authToken", token);
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message); // Email not verified, alert user
      } else if (error.response && error.response.status === 302) {
        const { token } = error.response.data;
        navigate(`/complete-profile?token=${token}`); // Redirect to complete profile
      } else if (error.response && error.response.status === 401) {
        alert(error.response.data.message); // Credentials incorrect
      } else {
        console.log(error);
        alert("Error during sign-in, possible server error. Try again.");
      }
    }
  };

  return (
    <form className="rux-form" onSubmit={handleSubmit}>
      <div className="sign-in-inputs">
        <label className="email-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="text"
          placeholder="Email@astro.com"
          name="email"
          required
          className="email-input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="password-label" htmlFor="password">
          Password
        </label>
        <input
          type="text"
          placeholder="Password"
          name="password"
          required
          className="password-input"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="sign-in-helpers">
        <p className="forgot-password">Forgot Password?</p>
      </div>
      <div className="sign-in-btn-box">
        <button className="sign-in-btn" type="submit">
          Sign in
        </button>
      </div>
    </form>
  );
};

export default SignIn;
