import React, { useEffect, useState } from "react";
import { RuxClock, RuxMonitoringIcon } from "@astrouxds/react";
import "../css/Credentials.css";
import "../css/SignIn.css"
import SignIn from "./SignIn";
import Register from "./Register";

const Credentials = () => {
  const [trigger, setTrigger] = useState(false);

  const onTrigger = (e) => {
    e.preventDefault();
    setTrigger(!trigger);
  }
  return (
    <div className="container">
      <div slot="header" className="header-container">
        <h3 className="first-header-item">LOGO</h3>
        <RuxClock timezone="Z" className="sign-in-clock"></RuxClock>
        <RuxMonitoringIcon status="normal" className="sign-in-status"></RuxMonitoringIcon>
      </div>
      <div className="body-container">
        <div className="sign-in-or-register">
          <a className="body-sign-in" href={<SignIn />} onClick={onTrigger}>SIGN IN</a>
          <a className="body-register" href={<Register />} onClick={onTrigger}>REGISTER</a>
        </div>
        {trigger ? <Register /> : <SignIn />}
      </div>
      <div slot="footer" className="footer"></div>
    </div>
  );
};

export default Credentials;
