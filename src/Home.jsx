// Add Docker compose once you set up your backend and other microservices
import React, { useState } from "react";
import {
  RuxClock,
  RuxMonitoringIcon,
  RuxContainer,
  RuxTab,
  RuxTabs,
} from "@astrouxds/react";
import "@astrouxds/astro-web-components/dist/components/rux-tab";
import "@astrouxds/astro-web-components/dist/components/rux-tabs";
import "./css/Home.css";
import Dashboard from "./Dashboard";
import WARs from "./WARs";
import "./css/Dashboard.css";
import Leaderboard from "./Leaderboard";
import SITREP from "./SITREP";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
      <RuxContainer>
        <div slot="tab-bar">
          <RuxTabs id="tab-id-2">
            <RuxTab
              id="tab-id-2-1"
              selected={activeTab === "dashboard"}
              onClick={(e) => setActiveTab("dashboard")}
            >
              Home
            </RuxTab>
            <RuxTab id="tab-id-2-2" onClick={(e) => setActiveTab("wars")}>
              Rate WARs
            </RuxTab>
            <RuxTab id="tab-id-2-4" onClick={(e) => setActiveTab("sitrep")}>
              SITREP
            </RuxTab>
            <RuxTab id="tab-id-2-3" onClick={(e) => setActiveTab("leaderboard")}>
              Leaderboard
            </RuxTab>
          </RuxTabs>
        </div>
        {activeTab === "dashboard" ? (
          <Dashboard />
        ) : activeTab === "wars" ? (
          <WARs />
        ) : activeTab === "sitrep" ? (
          <SITREP />
        ) : activeTab === "leaderboard" ? (
          <Leaderboard />
        ) : (
          ""
        )}
      </RuxContainer>
      <div className="body-container"> </div>
      <div slot="footer" className="footer"></div>
    </div>
  );
};

export default Home;
