// Add Docker compose once you set up your backend and other microservices
import React, { useState } from "react";
import { RuxClock, RuxMonitoringIcon } from "@astrouxds/react";
import "../css/Credentials.css";
import "../css/SignIn.css";
import SignIn from "./SignIn";
import Register from "./Register";

const Credentials = () => {
  const [activeForm, setActiveForm] = useState("sign in");

  const onTrigger = (e, formType) => {
    e.preventDefault();
    // Only update if the clicked button is for a different form
    if (activeForm !== formType) {
      setActiveForm(formType);
    }
  };

  return (
    <div className="container">
      <div slot="header" className="header-container">
        <h3 className="first-header-item">LOGO</h3>
        <RuxClock timezone="Z" className="sign-in-clock"></RuxClock>
        <RuxMonitoringIcon
          status="normal"
          className="sign-in-status"
        ></RuxMonitoringIcon>
      </div>
      <div className="body-container">
        <div className="sign-in-or-register">
          <a
            className="body-sign-in"
            href={<SignIn />}
            onClick={(e) => onTrigger(e, "sign in")}
          >
            SIGN IN
          </a>
          <a
            className="body-register"
            href={<Register />}
            onClick={(e) => onTrigger(e, "register")}
          >
            REGISTER
          </a>
        </div>
        <h4 className="measure-success-text">
          Measure your success in Space Force!
        </h4>
        {activeForm === "sign in" ? <SignIn /> : <Register />}
      </div>
      <div slot="footer" className="footer"></div>
    </div>
  );
};

export default Credentials;
