import React, { useEffect, useState } from "react";
import "../css/Register.css";
import ReactPasswordChecklist from "react-password-checklist";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(mil|gov)$/;

    if (!emailPattern.test(email)) {
      alert("Please enter a valid .mil or .gov email address");
    }

    if (!validPassword) {
      alert("Password is not valid, try again.");
    }
  };

  return (
    <form className="rux-form" onSubmit={handleSubmit}>
      <div className="register-inputs">
        <label className="email-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="text"
          placeholder="Please enter a valid .mil or .gov email address"
          name="email"
          required
          className="email-input"
          onChange={(e) => setEmail(e.target.value)}
        />
        <ReactPasswordChecklist
          rules={[
            "minLength",
            "specialChar",
            "match",
            "notEmpty",
            "noSpaces",
            "letter",
          ]}
          minLength={15}
          value={password}
          valueAgain={confirmPassword}
          onChange={(isValid) => setValidPassword(isValid)}
          validTextColor="white"
          invalidTextColor="white"
        />
        <label className="password-label" htmlFor="email">
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
        <label className="confirm-password-label" htmlFor="email">
          Confirm Password
        </label>
        <input
          type="text"
          placeholder="Confirm Password"
          name="confirm-password"
          required
          className="confirm-password-input"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="sign-in-btn-box">
        <button className="sign-in-btn" type="submit">
          Sign in
        </button>
      </div>
    </form>
  );
};

export default Register;
