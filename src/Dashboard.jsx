import React from "react";
import {
  RuxCard,
  RuxContainer,
  RuxIcon,
  RuxTab,
  RuxTabs,
} from "@astrouxds/react";
import "./css/Dashboard.css";

function Dashboard() {
  return (
    <div className="cards-container">
      <button class="war-button">
        <span>Create a WAR</span>
        <span class="plus-icon">+</span>
      </button>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>WARs Submitted</h4>
          <RuxIcon icon="description" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            Averaging a <strong className="rating">4.5</strong> rating from
            others
          </h5>
          <RuxIcon icon="trending-up" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            WARs Edits <br />
            Approved
          </h4>
          <RuxIcon icon="edit" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            Estimated approval rating of <strong className="rating">17%</strong>
          </h5>
          <RuxIcon icon="check-circle" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            Unclassified Edits <br />
            Approved
          </h4>
          <RuxIcon icon="publish" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            While maintaining a <strong className="rating">good </strong>
            impact
            <br /> statement
          </h5>
          <RuxIcon icon="gavel" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            Points gained this <br />
            year
          </h4>
          <RuxIcon icon="score" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            Placing in the top <strong className="rating">10%</strong> against{" "}
            <br />
            other teammates in the Space Force
          </h5>
          <RuxIcon icon="grade" size="small" className="icons" />
        </div>
      </div>
      <div className="card-container">
        <div slot="header" className="card-header">
          <h4>
            EPR bullets <br />
            accepted
          </h4>
          <RuxIcon icon="supervisor-account" size="small" />
        </div>
        <div className="card-body">
          <h1>0</h1>
        </div>
        <div slot="footer" className="card-footer">
          <h5>
            That delivers, on average, an <br />
            <strong className="rating">exceeded some</strong> rating
          </h5>
          <RuxIcon icon="mission" size="small" className="icons" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
