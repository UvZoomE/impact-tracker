// Add Docker compose once you set up your backend and other microservices
import React from "react";
import { RuxClock, RuxMonitoringIcon } from "@astrouxds/react";

const Home = () => {
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
        <div slot="footer" className="footer"></div>
      </div>
    </div>
  );
};

export default Home;
