// Add Docker compose once you set up your backend and other microservices
import React, { useEffect, useState } from "react";
import { RuxClock, RuxMonitoringIcon } from "@astrouxds/react";
import "@astrouxds/astro-web-components/dist/components/rux-tab";
import "@astrouxds/astro-web-components/dist/components/rux-tabs";
import "./css/Home.css";

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
      <div className="rux-tabs-family">
        <rux-tabs className="rux-family">
          <rux-tab id="tab-id-2-1" onClick={(e) => console.log("hi")}>
            Home
          </rux-tab>
          <rux-tab id="tab-id-2-2">Rate WARs</rux-tab>
          <rux-tab id="tab-id-2-3">Messages</rux-tab>
          <rux-tab id="tab-id-2-4">Settings</rux-tab>
        </rux-tabs>
      </div>
      <div className="body-container"></div>
      <div slot="footer" className="footer"></div>
    </div>
  );
};

export default Home;
