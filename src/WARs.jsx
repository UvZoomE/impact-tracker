import React, { useEffect, useState } from "react";
import {
  RuxCard,
  RuxTab,
  RuxTabs,
  RuxClassificationMarking,
  RuxIcon,
  RuxButton,
} from "@astrouxds/react";
import "./css/WARs.css";
import axios from "axios";
import { Avatar } from "@mui/material";

function WARs() {
  const [allWars, setAllWars] = useState([]);

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wars`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token as a Bearer token
          },
          params: { need: "eachWAR" },
        },
      );
      setAllWars(response.data);
    })();
  }, []);

  return (
    <div>
      <RuxTabs className="rate-war-tabs">
        <RuxTab className="rate-war-tab">To-do</RuxTab>
        <RuxTab className="rate-war-tab">Local</RuxTab>
        <RuxTab className="rate-war-tab">Global</RuxTab>
      </RuxTabs>
      <div className="rate-wars-background">
        {allWars &&
          allWars.map((element) => (
            <RuxCard key={element._id} className="test">
              <div slot="header">
                <RuxClassificationMarking
                  classification={element.classification}
                ></RuxClassificationMarking>
              </div>
              <div className="war-card-first-row">
                <div className="avatar-container">
                  <Avatar src="random" className="avatar" />
                  <p className="name">{element.name}</p>{" "}
                  {/* Element name directly under Avatar */}
                </div>
                <div className="card-title-with-line">
                  <h2>{element.title}</h2>
                  <hr />
                </div>
                <h3>
                  Date Posted: <span>{formatDate(element.createdAt)}</span>
                </h3>
              </div>
              <div className="war-card-second-row">
                <div className="card-content">
                  <p>
                    Description:{" "}
                    <span className="card-description">
                      {element.description}
                    </span>
                  </p>
                  <p>
                    Impact:{" "}
                    <span className="card-impact">{element.impact}</span>
                  </p>
                  {element.files ? (
                    <RuxIcon icon="folder" className="attachment">
                      File(s) provided
                    </RuxIcon>
                  ) : (
                    ""
                  )}
                  <p>
                    POC: <span className="card-poc">{element.poc}</span>
                  </p>
                  <RuxButton icon="star" className="war-card-button">
                    Rate WAR!
                  </RuxButton>
                </div>
              </div>
            </RuxCard>
          ))}
      </div>
    </div>
  );
}

export default WARs;
