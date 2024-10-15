// Add Docker compose once you set up your backend and other microservices
import React, { useState } from "react";
import {
  RuxClock,
  RuxMonitoringIcon,
  RuxContainer,
  RuxTab,
  RuxTabs,
  RuxTabPanels,
  RuxTabPanel,
  RuxIcon,
} from "@astrouxds/react";
import "@astrouxds/astro-web-components/dist/components/rux-tab";
import "@astrouxds/astro-web-components/dist/components/rux-tabs";
import "./css/Home.css";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import WARs from "./WARs";
import Messages from "./Messages";
import Leaderboard from "./components/Leaderboard";
import "./css/Dashboard.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
      <RuxContainer>
        <div slot="tab-bar" className="tab-bar-container">
          <RuxTabs id="tab-id-2" className="centered-tabs">
            <RuxTab
              id="tab-id-2-1"
              selected={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            >
              Home
            </RuxTab>
            <RuxTab id="tab-id-2-2" onClick={() => setActiveTab("wars")}>
              Rate WARs
            </RuxTab>
            <RuxTab id="tab-id-2-3" onClick={() => setActiveTab("messages")}>
              Messages
            </RuxTab>
            <RuxTab id="tab-id-2-4" onClick={() => setActiveTab("settings")}>
              Settings
            </RuxTab>
            <RuxTab id="tab-id-2-5" onClick={() => setActiveTab("leaderboard")}>
              Leaderboard
            </RuxTab>
          </RuxTabs>
          <div className="logout-button" onClick={handleLogout}>
            <RuxIcon icon="power_settings_new" size="small" />
            <span>Logout</span>
          </div>
        </div>
        <RuxTabPanels>
          <RuxTabPanel aria-labelledby="tab-id-2-1">
            {activeTab === "dashboard" && <Dashboard />}
          </RuxTabPanel>
          <RuxTabPanel aria-labelledby="tab-id-2-2">
            {activeTab === "wars" && <WARs />}
          </RuxTabPanel>
          <RuxTabPanel aria-labelledby="tab-id-2-3">
            {activeTab === "messages" && <Messages />}
          </RuxTabPanel>
          <RuxTabPanel aria-labelledby="tab-id-2-4">
            {activeTab === "settings" && <Settings />}
          </RuxTabPanel>
          <RuxTabPanel aria-labelledby="tab-id-2-5">
            {activeTab === "leaderboard" && <Leaderboard />}
          </RuxTabPanel>
        </RuxTabPanels>
      </RuxContainer>
      <div className="body-container"> </div>
      <div slot="footer" className="footer"></div>
    </div>
  );
};

export default Home;
