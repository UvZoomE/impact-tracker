import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import "../css/SignIn.css";

const Register = () => {
  return (
    <form className="rux-form">
    <h6 className="body-quote">
    Measure your success in the Space Force!
    </h6>
    <div className="sign-in-inputs">
        <label className="email-label" htmlFor="email">Email</label>
        <input
        id="email"
        type="text"
        placeholder="Email@astro.com"
        name="email"
        required
        className="email-input"
        />
        <input 
        type="text"
        placeholder="password"
        name="password"
        required
        className="password-input"
        />
        <input 
        type="text"
        placeholder="confirm password"
        name="confirm-password"
        required
        className="confirm-password-input"
        />
        <input 
        type="text"
        placeholder="DoD ID"
        name="dod-id"
        required
        className="dod-id-input"
        />
    </div>
    <div className="sign-in-helper-functions">
        <label className="checkbox-control">
        <input type="checkbox" name="checkbox" className="remember-me"/>
        Remember me
        </label>
        <p className="forgot-password">Forgot Password?</p>
    </div>
    <div className="sign-in-btn-container">
        <button className="sign-in-btn" type="submit">
        Sign in
        </button>
        <p className="smaller-forgot-password">Forgot Password?</p>
    </div>
</form>
  );
};

export default Register;