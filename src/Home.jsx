// Add Docker compose once you set up your backend and other microservices
import React, { useEffect, useState } from "react";
import { RuxClock, RuxMonitoringIcon } from "@astrouxds/react";

const Home = () => {
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
      <div className="body-container"></div>
      <div slot="footer" className="footer"></div>
    </div>
  );
};

export default Home;
